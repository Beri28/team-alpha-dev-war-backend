import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export const processImage = async (file) => {
  let processedFilename = '';
  let outputPath = '';

  try {
    processedFilename = `processed_${file.filename}`;
    outputPath = path.join(file.destination, processedFilename);
    
    // Process image with sharp
    await sharp(file.path)
      .resize(1200, 1200, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 80,
        mozjpeg: true 
      })
      .toFile(outputPath);
    
    // Remove original file with error handling
   // await deleteImageFile(file.path);
    
    return {
      path: outputPath,
      mimetype: 'image/jpeg',
      filename: processedFilename
    };
  } catch (error) {
    // Clean up if processing failed
    if (outputPath) {
      await deleteImageFile(outputPath).catch(cleanupError => {
        console.error('Cleanup error:', cleanupError);
      });
    }
    
    console.error('Error processing image:', error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
};

export const deleteImageFile = async (filePath) => {
  try {
    await fs.access(filePath); // First check if file exists
    await fs.unlink(filePath);
    console.log(`Successfully deleted: ${filePath}`);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`File not found, already deleted: ${filePath}`);
      return true; // Consider file already deleted as success
    }
    
    if (error.code === 'EPERM') {
      console.error(`Permission error deleting file: ${filePath}`);
      // Optional: Implement retry logic here if needed
      throw new Error(`Permission denied when trying to delete file: ${filePath}`);
    }
    
    console.error(`Error deleting file (${filePath}):`, error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};