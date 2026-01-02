import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import { Camera, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * ImageUpload Component
 * 
 * Props:
 * - value: Current image URL
 * - onChange: Callback when image is uploaded (receives URL)
 * - bucket: Supabase storage bucket name (default: 'images')
 * - folder: Folder path within bucket (e.g., 'avatars', 'devices')
 * - maxSize: Max file size in MB (default: 5)
 * - accept: Accepted file types (default: 'image/*')
 * - variant: 'avatar' | 'square' | 'banner' | 'device'
 * - disabled: Disable upload functionality
 * - className: Additional classes
 */
const ImageUpload = ({
    value,
    onChange,
    bucket = 'images',
    folder = 'uploads',
    maxSize = 5,
    accept = 'image/*',
    variant = 'square',
    disabled = false,
    className,
    placeholder
}) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);
    const { toast } = useToast();

    // Variant styles
    const variantStyles = {
        avatar: 'w-24 h-24 rounded-full',
        square: 'w-full aspect-square rounded-lg',
        banner: 'w-full aspect-[3/1] rounded-lg',
        device: 'w-full aspect-[4/3] rounded-lg'
    };

    // Handle file selection
    const handleFile = async (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image file.",
                variant: "destructive"
            });
            return;
        }

        // Validate file size
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > maxSize) {
            toast({
                title: "File too large",
                description: `Maximum file size is ${maxSize}MB.`,
                variant: "destructive"
            });
            return;
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        // Upload to Supabase Storage
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            const publicUrl = urlData.publicUrl;

            onChange?.(publicUrl);
            setPreview(publicUrl);

            toast({
                title: "Image uploaded",
                description: "Your image has been uploaded successfully.",
            });
        } catch (error) {
            console.error('Upload error:', error);
            setPreview(value); // Revert to original
            toast({
                title: "Upload failed",
                description: error.message || "Failed to upload image. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // Handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (disabled) return;

        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    // Remove image
    const handleRemove = (e) => {
        e.stopPropagation();
        setPreview(null);
        onChange?.(null);
    };

    return (
        <div className={cn("relative", className)}>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                disabled={disabled || uploading}
                className="hidden"
            />

            {/* Upload Area */}
            <div
                onClick={() => !disabled && !uploading && inputRef.current?.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                    variantStyles[variant],
                    "relative overflow-hidden cursor-pointer transition-all duration-200",
                    "border-2 border-dashed",
                    "flex items-center justify-center",
                    preview
                        ? "border-transparent"
                        : dragActive
                            ? "border-white bg-white/10"
                            : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50",
                    disabled && "opacity-50 cursor-not-allowed",
                    className
                )}
            >
                {/* Preview Image */}
                {preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* Overlay for existing image */}
                {preview && !uploading && !disabled && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                inputRef.current?.click();
                            }}
                        >
                            <Camera className="h-4 w-4 mr-1" />
                            Change
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Empty State / Placeholder */}
                {!preview && !uploading && (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                        {variant === 'avatar' ? (
                            <Camera className="h-8 w-8 text-zinc-500 mb-2" />
                        ) : (
                            <Upload className="h-8 w-8 text-zinc-500 mb-2" />
                        )}
                        <p className="text-sm text-zinc-400">
                            {placeholder || (
                                <>
                                    <span className="font-medium text-white">Click to upload</span>
                                    <br />
                                    or drag and drop
                                </>
                            )}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                            Max {maxSize}MB
                        </p>
                    </div>
                )}

                {/* Uploading State */}
                {uploading && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-2" />
                            <p className="text-sm text-zinc-300">Uploading...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * MultiImageUpload Component
 * For uploading multiple images (e.g., device issue photos)
 */
const MultiImageUpload = ({
    value = [],
    onChange,
    maxImages = 5,
    bucket = 'images',
    folder = 'uploads',
    maxSize = 5,
    disabled = false,
    className
}) => {
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef(null);
    const { toast } = useToast();

    const handleFiles = async (files) => {
        const fileArray = Array.from(files);

        if (value.length + fileArray.length > maxImages) {
            toast({
                title: "Too many images",
                description: `Maximum ${maxImages} images allowed.`,
                variant: "destructive"
            });
            return;
        }

        setUploading(true);
        const newUrls = [...value];

        try {
            for (const file of fileArray) {
                if (!file.type.startsWith('image/')) continue;
                if (file.size / (1024 * 1024) > maxSize) continue;

                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${folder}/${fileName}`;

                const { data, error } = await supabase.storage
                    .from(bucket)
                    .upload(filePath, file);

                if (!error) {
                    const { data: urlData } = supabase.storage
                        .from(bucket)
                        .getPublicUrl(filePath);
                    newUrls.push(urlData.publicUrl);
                }
            }

            onChange?.(newUrls);
            toast({
                title: "Images uploaded",
                description: `${fileArray.length} image(s) uploaded successfully.`,
            });
        } catch (error) {
            toast({
                title: "Upload failed",
                description: "Some images failed to upload.",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        const newUrls = value.filter((_, i) => i !== index);
        onChange?.(newUrls);
    };

    return (
        <div className={cn("space-y-4", className)}>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                disabled={disabled || uploading}
                className="hidden"
            />

            {/* Image Grid */}
            <div className="grid grid-cols-4 gap-3">
                {value.map((url, index) => (
                    <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group"
                    >
                        <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="h-3 w-3 text-white" />
                        </button>
                    </div>
                ))}

                {/* Add More Button */}
                {value.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={disabled || uploading}
                        className={cn(
                            "aspect-square rounded-lg border-2 border-dashed border-zinc-700",
                            "flex flex-col items-center justify-center gap-1",
                            "hover:border-zinc-500 transition-colors",
                            "text-zinc-500 hover:text-zinc-300",
                            (disabled || uploading) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {uploading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                <ImageIcon className="h-6 w-6" />
                                <span className="text-xs">Add Photo</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            <p className="text-xs text-zinc-500">
                {value.length}/{maxImages} images • Max {maxSize}MB each
            </p>
        </div>
    );
};

export { ImageUpload, MultiImageUpload };
