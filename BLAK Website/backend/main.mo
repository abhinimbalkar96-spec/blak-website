import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Float;
    stock : Nat;
    category : Text;
    sizes : [Text];
    image : ?Storage.ExternalBlob;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.id, product2.id);
    };
  };

  type CartItem = {
    productId : Text;
    quantity : Nat;
    size : ?Text;
  };

  type CheckoutForm = {
    name : Text;
    address : Text;
    city : Text;
    postalCode : Text;
    country : Text;
    email : Text;
  };

  type Order = {
    id : Text;
    items : [CartItem];
    total : Float;
    checkoutForm : CheckoutForm;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    address : Text;
    city : Text;
    postalCode : Text;
    country : Text;
  };

  let products = Map.empty<Text, Product>();
  let orders = Map.empty<Text, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    if (not products.containsKey(product.id)) {
      Runtime.trap("Product does not exist");
    };
    products.add(product.id, product);
  };

  public shared ({ caller }) func deleteProduct(productId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    if (not products.containsKey(productId)) {
      Runtime.trap("Product does not exist");
    };
    products.remove(productId);
  };

  public shared ({ caller }) func adjustStock(productId : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can adjust stock");
    };
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product does not exist") };
      case (?product) {
        let updatedProduct = {
          id = product.id;
          name = product.name;
          description = product.description;
          price = product.price;
          stock = quantity;
          category = product.category;
          sizes = product.sizes;
          image = product.image;
        };
        products.add(productId, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func completeOrder(order : Order) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can place orders");
    };

    let orderId = order.id;
    orders.add(orderId, order);

    // Update product stock
    for (item in order.items.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product does not exist") };
        case (?product) {
          if (product.stock < item.quantity) {
            Runtime.trap("Insufficient stock for product " # product.name);
          };
          let updatedProduct = {
            id = product.id;
            name = product.name;
            description = product.description;
            price = product.price;
            stock = product.stock - item.quantity;
            category = product.category;
            sizes = product.sizes;
            image = product.image;
          };
          products.add(item.productId, updatedProduct);
        };
      };
    };

    orderId;
  };
};
