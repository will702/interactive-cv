import { useCvStore } from './cvStore';
import { cvWorkerClient } from './cvWorkerClient';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Converts an image (URL path, data URI, or raw base64) to a raw base64 string.
 * Handles public URL paths like "/left01.jpg" by fetching them first.
 */
async function toBase64(image: string): Promise<string> {
  if (image.startsWith('/') || image.startsWith('http')) {
    const res = await fetch(image);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        resolve(dataUri.split(',')[1] || dataUri);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  return image.split(',')[1] || image;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function applyKernel(image: string, kernel: number[][], borderType: string = 'reflect') {
  if (useCvStore.getState().cvReady) {
    const result = await cvWorkerClient.applyKernel(image, kernel);
    return { result_image: result.split(',')[1] || result };
  }
  
  const base64Data = await toBase64(image);
  return fetchApi('/api/filtering/apply-kernel', {
    method: 'POST',
    body: JSON.stringify({ image: base64Data, kernel, border_type: borderType }),
  });
}

export async function convVsCorr(image: string, kernel: number[][]) {
  if (useCvStore.getState().cvReady) {
    const { convolution, correlation } = await cvWorkerClient.convVsCorr(image, kernel);
    return { 
      convolution: convolution.split(',')[1] || convolution,
      correlation: correlation.split(',')[1] || correlation
    };
  }

  const base64Data = await toBase64(image);
  return fetchApi('/api/filtering/conv-vs-corr', {
    method: 'POST',
    body: JSON.stringify({ image: base64Data, kernel }),
  });
}

export async function harrisCorners(image: string, blockSize: number, ksize: number, k: number, thresholdRatio: number) {
  if (useCvStore.getState().cvReady) {
    const { resultImage, cornerCount } = await cvWorkerClient.harrisCorners(image, blockSize, ksize, k, thresholdRatio);
    return { 
      result_image: resultImage.split(',')[1] || resultImage,
      corner_count: cornerCount
    };
  }

  const base64Data = await toBase64(image);
  return fetchApi('/api/features/harris', {
    method: 'POST',
    body: JSON.stringify({ image: base64Data, block_size: blockSize, ksize, k, threshold_ratio: thresholdRatio }),
  });
}

export async function detectFeatures(image: string, method: string, nFeatures: number) {
  if (useCvStore.getState().cvReady) {
    const { resultImage, keypointCount } = await cvWorkerClient.detectFeatures(image, method as 'SIFT' | 'ORB', nFeatures);
    return { 
      result_image: resultImage.split(',')[1] || resultImage,
      keypoint_count: keypointCount
    };
  }

  const base64Data = await toBase64(image);
  return fetchApi('/api/features/detect', {
    method: 'POST',
    body: JSON.stringify({ image: base64Data, method, n_features: nFeatures }),
  });
}

export async function matchFeatures(image1: string, image2: string, nFeatures: number, ratio: number) {
  if (useCvStore.getState().cvReady) {
    const { resultImage, matchCount } = await cvWorkerClient.matchFeatures(image1, image2, nFeatures, ratio);
    return { 
      result_image: resultImage.split(',')[1] || resultImage,
      match_count: matchCount
    };
  }

  const b1 = await toBase64(image1);
  const b2 = await toBase64(image2);
  return fetchApi('/api/features/match', {
    method: 'POST',
    body: JSON.stringify({ image1: b1, image2: b2, n_features: nFeatures, ratio }),
  });
}

export async function estimateHomography(image1: string, image2: string, nFeatures: number, ratio: number, ransacThreshold: number) {
  if (useCvStore.getState().cvReady) {
    const { resultImage, inlierCount } = await cvWorkerClient.estimateHomography(image1, image2, nFeatures, ratio, ransacThreshold);
    return { 
      result_image: resultImage.split(',')[1] || resultImage,
      inlier_count: inlierCount
    };
  }

  const b1 = await toBase64(image1);
  const b2 = await toBase64(image2);
  return fetchApi('/api/features/homography', {
    method: 'POST',
    body: JSON.stringify({ image1: b1, image2: b2, n_features: nFeatures, ratio, ransac_threshold: ransacThreshold }),
  });
}

export async function computeFundamental(image1: string, image2: string, nFeatures: number, ratio: number, ransacThreshold: number = 1.0) {
  if (useCvStore.getState().cvReady) {
    const { resultImage, inlierCount, F_matrix } = await cvWorkerClient.computeFundamental(image1, image2, nFeatures, ratio);
    return { 
      result_image: resultImage.split(',')[1] || resultImage,
      inlier_count: inlierCount,
      F_matrix
    };
  }

  const b1 = await toBase64(image1);
  const b2 = await toBase64(image2);
  return fetchApi('/api/epipolar/fundamental', {
    method: 'POST',
    body: JSON.stringify({ image1: b1, image2: b2, n_features: nFeatures, ratio, ransac_threshold: ransacThreshold }),
  });
}

export async function computeEssential(image1: string, image2: string, nFeatures: number, ratio: number, ransacThreshold: number = 1.0) {
  if (useCvStore.getState().cvReady) {
    const { R, t, inlierCount } = await cvWorkerClient.computeEssential(image1, image2, nFeatures, ratio);
    return { R, t, inliers: inlierCount };
  }

  const b1 = await toBase64(image1);
  const b2 = await toBase64(image2);
  return fetchApi('/api/epipolar/essential', {
    method: 'POST',
    body: JSON.stringify({ image1: b1, image2: b2, n_features: nFeatures, ratio, ransac_threshold: ransacThreshold }),
  });
}

export async function computeTriangulation(image1: string, image2: string, nFeatures: number, ratio: number, ransacThreshold: number = 1.0) {
  if (useCvStore.getState().cvReady) {
    const { points3d, cam2, cam2_pos } = await cvWorkerClient.computeTriangulation(image1, image2, nFeatures, ratio);
    return { points_3d: points3d, cam2, cam2_pos };
  }

  const b1 = await toBase64(image1);
  const b2 = await toBase64(image2);
  return fetchApi('/api/epipolar/triangulate', {
    method: 'POST',
    body: JSON.stringify({ image1: b1, image2: b2, n_features: nFeatures, ratio, ransac_threshold: ransacThreshold }),
  });
}
