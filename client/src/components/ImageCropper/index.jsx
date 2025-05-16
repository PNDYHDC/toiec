/* eslint-disable react/prop-types */
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import convertBlobToFile from '../../utils/convertBlobToFile';
import Overlay from '../common/Overlay';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';

const ImageCropper = ({ width, height, idName, label, type = '', onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    const onSelectFile = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImageSrc(reader.result);
            reader.readAsDataURL(file);
            setIsCropping(true);
        }
    };

    const onCropDone = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const cropImage = async () => {
        if (!croppedAreaPixels || !imageSrc) return;
        try {
            const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
            const file = await convertBlobToFile(croppedImg);
            onCropComplete(file, idName);
            setIsCropping(false);
        } catch (error) {
            console.error('Lỗi cắt ảnh:', error);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <input id={idName} type="file" multiple hidden onChange={onSelectFile} />
            <label
                htmlFor={idName}
                className={`flex w-full gap-2 ${type === 'search' ? '' : ' text-secondary'} text-sm`}
            >
                {type === 'search' ? (
                    <CenterFocusWeakIcon />
                ) : (
                    <>
                        {label}
                        <InsertPhotoIcon fontSize="medium" style={{ color: 'green' }} />
                    </>
                )}
            </label>
            {isCropping && imageSrc && (
                <Overlay>
                    <div className="relative w-[350px] h-[350px]" style={{ backgroundColor: '#ddd' }}>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={width / height}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropDone}
                        />
                        <button onClick={cropImage} className="absolute top-2 left-2 bg-blue-500 text-white px-3 py-1">
                            Cắt ảnh
                        </button>
                    </div>
                </Overlay>
            )}
        </div>
    );
};

const getCroppedImg = async (imageSrc, cropArea) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Không thể tạo canvas');
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;
    ctx.drawImage(image, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(URL.createObjectURL(blob));
        }, 'image/jpeg');
    });
};

const createImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
};

export default ImageCropper;
