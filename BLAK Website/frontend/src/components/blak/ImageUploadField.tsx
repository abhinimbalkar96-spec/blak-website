import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { ExternalBlob } from '../../backend';

interface ImageUploadFieldProps {
  currentImage: ExternalBlob | null;
  onImageChange: (image: ExternalBlob | null) => void;
}

export default function ImageUploadField({ currentImage, onImageChange }: ImageUploadFieldProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      onImageChange(blob);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const previewUrl = currentImage ? currentImage.getDirectURL() : null;

  return (
    <div>
      <Label>Product Image</Label>
      <div className="mt-2">
        {previewUrl && (
          <div className="mb-4">
            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
          </div>
        )}

        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 mb-2 animate-spin" />
                <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload image</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>
    </div>
  );
}
