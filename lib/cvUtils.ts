/**
 * Utility functions for OpenCV.js operations in Next.js
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Loads a base64 or URL image into an HTMLImageElement
 */
export async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Converts a base64 image string to an OpenCV Mat
 */
export async function base64ToMat(base64: string): Promise<any> {
  const img = await loadImage(base64);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  ctx.drawImage(img, 0, 0);
  return window.cv.imread(canvas);
}

/**
 * Converts an OpenCV Mat to a base64 JPEG string
 */
export function matToBase64(mat: any): string {
  const canvas = document.createElement('canvas');
  window.cv.imshow(canvas, mat);
  return canvas.toDataURL('image/jpeg');
}

/**
 * Applies a 2D filter (kernel) to an image
 */
export async function applyKernelLocal(base64: string, kernel: number[][]): Promise<string> {
  const src = await base64ToMat(base64);
  const dst = new window.cv.Mat();
  
  // Convert 2D array kernel to cv.Mat
  const rows = kernel.length;
  const cols = kernel[0].length;
  const kernelMat = window.cv.matFromArray(rows, cols, window.cv.CV_32F, kernel.flat());
  
  // For derivative kernels (Sobel, Laplacian) that sum to ~0, 
  // add an offset of 128 to visualize negative values as darker gray.
  const kernelSum = kernel.flat().reduce((a, b) => a + b, 0);
  const delta = Math.abs(kernelSum) < 0.01 ? 128 : 0;
  
  window.cv.filter2D(src, dst, window.cv.CV_8U, kernelMat, new window.cv.Point(-1, -1), delta, window.cv.BORDER_DEFAULT);
  
  const result = matToBase64(dst);
  
  src.delete();
  dst.delete();
  kernelMat.delete();
  
  return result;
}

/**
 * Calculates Harris corners locally
 */
export async function harrisCornersLocal(
  base64: string, 
  blockSize: number, 
  ksize: number, 
  k: number, 
  thresholdRatio: number
): Promise<{ resultImage: string, cornerCount: number }> {
  const src = await base64ToMat(base64);
  const gray = new window.cv.Mat();
  window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);
  
  const dst = new window.cv.Mat();
  window.cv.cornerHarris(gray, dst, blockSize, ksize, k, window.cv.BORDER_DEFAULT);
  
  // Find max response for relative thresholding
  const data = dst.data32F;
  let maxVal = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > maxVal) maxVal = data[i];
  }
  
  const threshold = maxVal * thresholdRatio;
  const result = src.clone();
  let count = 0;
  
  const rows = dst.rows;
  const cols = dst.cols;
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (data[i * cols + j] > threshold) {
        count++;
        // Draw red dot
        const color = new window.cv.Scalar(255, 0, 0, 255);
        window.cv.circle(result, new window.cv.Point(j, i), 2, color, -1);
      }
    }
  }
  
  const b64 = matToBase64(result);
  
  src.delete();
  gray.delete();
  dst.delete();
  result.delete();
  
  return { resultImage: b64, cornerCount: count };
}

/**
 * Detects features using SIFT or ORB
 */
export async function detectFeaturesLocal(
  base64: string, 
  method: 'SIFT' | 'ORB', 
  nFeatures: number
): Promise<{ resultImage: string, keypointCount: number }> {
  const src = await base64ToMat(base64);
  const gray = new window.cv.Mat();
  window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);
  
  let detector;
  if (method === 'SIFT') {
    detector = new window.cv.SIFT(nFeatures);
  } else {
    detector = new window.cv.ORB(nFeatures);
  }
  
  const keypoints = new window.cv.KeyPointVector();
  const descriptors = new window.cv.Mat();
  detector.detectAndCompute(gray, new window.cv.Mat(), keypoints, descriptors);
  
  const result = new window.cv.Mat();
  window.cv.drawKeypoints(src, keypoints, result, new window.cv.Scalar(0, 255, 0, 255), window.cv.DrawMatchesFlags_DRAW_RICH_KEYPOINTS);
  
  const b64 = matToBase64(result);
  const count = keypoints.size();
  
  src.delete();
  gray.delete();
  keypoints.delete();
  descriptors.delete();
  result.delete();
  if (detector.delete) detector.delete();
  
  return { resultImage: b64, keypointCount: count };
}

/**
 * Matches features between two images
 */
export async function matchFeaturesLocal(
  image1: string, 
  image2: string, 
  nFeatures: number, 
  ratio: number
): Promise<{ resultImage: string, matchCount: number }> {
  const src1 = await base64ToMat(image1);
  const src2 = await base64ToMat(image2);
  
  const gray1 = new window.cv.Mat();
  const gray2 = new window.cv.Mat();
  window.cv.cvtColor(src1, gray1, window.cv.COLOR_RGBA2GRAY);
  window.cv.cvtColor(src2, gray2, window.cv.COLOR_RGBA2GRAY);
  
  const orb = new window.cv.ORB(nFeatures);
  const kp1 = new window.cv.KeyPointVector();
  const kp2 = new window.cv.KeyPointVector();
  const des1 = new window.cv.Mat();
  const des2 = new window.cv.Mat();
  
  orb.detectAndCompute(gray1, new window.cv.Mat(), kp1, des1);
  orb.detectAndCompute(gray2, new window.cv.Mat(), kp2, des2);
  
  // BFMatcher with Hamming distance for ORB
  const bf = new window.cv.BFMatcher(window.cv.NORM_HAMMING, false);
  const matches = new window.cv.DMatchVectorVector();
  bf.knnMatch(des1, des2, matches, 2);
  
  // Lowe's ratio test
  const goodMatches = new window.cv.DMatchVector();
  for (let i = 0; i < matches.size(); i++) {
    const match = matches.get(i);
    if (match.size() === 2) {
      const m = match.get(0);
      const n = match.get(1);
      if (m.distance < ratio * n.distance) {
        goodMatches.push_back(m);
      }
    }
  }
  
  const result = new window.cv.Mat();
  window.cv.drawMatches(src1, kp1, src2, kp2, goodMatches, result, new window.cv.Scalar(0, 255, 0, 255), new window.cv.Scalar(255, 0, 0, 255));
  
  const b64 = matToBase64(result);
  const count = goodMatches.size();
  
  src1.delete(); src2.delete();
  gray1.delete(); gray2.delete();
  kp1.delete(); kp2.delete();
  des1.delete(); des2.delete();
  bf.delete();
  matches.delete();
  goodMatches.delete();
  result.delete();
  orb.delete();
  
  return { resultImage: b64, matchCount: count };
}

/**
 * Estimates Homography between two images
 */
export async function estimateHomographyLocal(
  image1: string, 
  image2: string, 
  nFeatures: number, 
  ratio: number,
  ransacThreshold: number
): Promise<{ resultImage: string, inlierCount: number }> {
  const src1 = await base64ToMat(image1);
  const src2 = await base64ToMat(image2);
  
  const gray1 = new window.cv.Mat();
  const gray2 = new window.cv.Mat();
  window.cv.cvtColor(src1, gray1, window.cv.COLOR_RGBA2GRAY);
  window.cv.cvtColor(src2, gray2, window.cv.COLOR_RGBA2GRAY);
  
  const orb = new window.cv.ORB(nFeatures);
  const kp1 = new window.cv.KeyPointVector();
  const kp2 = new window.cv.KeyPointVector();
  const des1 = new window.cv.Mat();
  const des2 = new window.cv.Mat();
  
  orb.detectAndCompute(gray1, new window.cv.Mat(), kp1, des1);
  orb.detectAndCompute(gray2, new window.cv.Mat(), kp2, des2);
  
  const bf = new window.cv.BFMatcher(window.cv.NORM_HAMMING, false);
  const matches = new window.cv.DMatchVectorVector();
  bf.knnMatch(des1, des2, matches, 2);
  
  const srcPts: number[] = [];
  const dstPts: number[] = [];
  
  for (let i = 0; i < matches.size(); i++) {
    const m = matches.get(i);
    if (m.size() === 2) {
      const first = m.get(0);
      const second = m.get(1);
      if (first.distance < ratio * second.distance) {
        srcPts.push(kp1.get(first.queryIdx).pt.x);
        srcPts.push(kp1.get(first.queryIdx).pt.y);
        dstPts.push(kp2.get(first.trainIdx).pt.x);
        dstPts.push(kp2.get(first.trainIdx).pt.y);
      }
    }
  }
  
  if (srcPts.length < 8) {
    throw new Error('Not enough matches to compute homography');
  }

  const srcMat = window.cv.matFromArray(srcPts.length / 2, 1, window.cv.CV_32FC2, srcPts);
  const dstMat = window.cv.matFromArray(dstPts.length / 2, 1, window.cv.CV_32FC2, dstPts);
  const mask = new window.cv.Mat();

  const H = window.cv.findHomography(srcMat, dstMat, window.cv.RANSAC || 8, ransacThreshold, mask);
  
  const inlierCount = window.cv.countNonZero(mask);
  
  // Create visualization: Warp src1 to src2
  const warped = new window.cv.Mat();
  window.cv.warpPerspective(src1, warped, H, new window.cv.Size(src2.cols, src2.rows));
  
  // Blend (simple 50/50 overlay for visualization)
  const blended = new window.cv.Mat();
  window.cv.addWeighted(src2, 0.5, warped, 0.5, 0, blended);
  
  const b64 = matToBase64(blended);
  
  src1.delete(); src2.delete(); gray1.delete(); gray2.delete();
  kp1.delete(); kp2.delete(); des1.delete(); des2.delete();
  bf.delete(); matches.delete(); srcMat.delete(); dstMat.delete();
  mask.delete(); H.delete(); warped.delete(); blended.delete(); orb.delete();
  
  return { resultImage: b64, inlierCount };
}

/**
 * Computes Fundamental Matrix
 */
export async function computeFundamentalLocal(
  image1: string, 
  image2: string, 
  nFeatures: number, 
  ratio: number
): Promise<{ resultImage: string, inlierCount: number, F_matrix: number[][] }> {
  const src1 = await base64ToMat(image1);
  const src2 = await base64ToMat(image2);
  
  const gray1 = new window.cv.Mat();
  const gray2 = new window.cv.Mat();
  window.cv.cvtColor(src1, gray1, window.cv.COLOR_RGBA2GRAY);
  window.cv.cvtColor(src2, gray2, window.cv.COLOR_RGBA2GRAY);
  
  const orb = new window.cv.ORB(nFeatures);
  const kp1 = new window.cv.KeyPointVector();
  const kp2 = new window.cv.KeyPointVector();
  const des1 = new window.cv.Mat();
  const des2 = new window.cv.Mat();
  
  orb.detectAndCompute(gray1, new window.cv.Mat(), kp1, des1);
  orb.detectAndCompute(gray2, new window.cv.Mat(), kp2, des2);
  
  const bf = new window.cv.BFMatcher(window.cv.NORM_HAMMING, false);
  const matches = new window.cv.DMatchVectorVector();
  bf.knnMatch(des1, des2, matches, 2);
  
  const srcPts: number[] = [];
  const dstPts: number[] = [];
  const goodMatches = new window.cv.DMatchVector();
  
  for (let i = 0; i < matches.size(); i++) {
    const m = matches.get(i);
    if (m.size() === 2) {
      const first = m.get(0);
      const second = m.get(1);
      if (first.distance < ratio * second.distance) {
        srcPts.push(kp1.get(first.queryIdx).pt.x);
        srcPts.push(kp1.get(first.queryIdx).pt.y);
        dstPts.push(kp2.get(first.trainIdx).pt.x);
        dstPts.push(kp2.get(first.trainIdx).pt.y);
        goodMatches.push_back(first);
      }
    }
  }
  
  if (srcPts.length < 16) {
    throw new Error('Not enough matches to compute fundamental matrix');
  }

  const srcMat = window.cv.matFromArray(srcPts.length / 2, 1, window.cv.CV_32FC2, srcPts);
  const dstMat = window.cv.matFromArray(dstPts.length / 2, 1, window.cv.CV_32FC2, dstPts);
  const mask = new window.cv.Mat();

  const F = window.cv.findFundamentalMat(srcMat, dstMat, window.cv.FM_RANSAC || 8, 1.0, 0.99, mask);
  
  // Draw epipolar lines on 10 random inliers
  const result = src2.clone();
  const lines = new window.cv.Mat();
  window.cv.computeCorrespondEpilines(srcMat, 1, F, lines);
  
  let drawCount = 0;
  for (let i = 0; i < mask.rows && drawCount < 10; i++) {
    if (mask.data[i] === 1) {
      const line = lines.floatPtr(i);
      const a = line[0];
      const b = line[1];
      const c = line[2];
      
      const x0 = 0;
      const y0 = Math.round(-c / b);
      const x1 = src2.cols;
      const y1 = Math.round(-(a * x1 + c) / b);
      
      const color = new window.cv.Scalar(Math.random() * 255, Math.random() * 255, Math.random() * 255, 255);
      window.cv.line(result, new window.cv.Point(x0, y0), new window.cv.Point(x1, y1), color, 2);
      drawCount++;
    }
  }
  
  // Convert F to 2D array for the frontend
  const fArray = [
    [F.doubleAt(0, 0), F.doubleAt(0, 1), F.doubleAt(0, 2)],
    [F.doubleAt(1, 0), F.doubleAt(1, 1), F.doubleAt(1, 2)],
    [F.doubleAt(2, 0), F.doubleAt(2, 1), F.doubleAt(2, 2)]
  ];
  
  const b64 = matToBase64(result);
  const inlierCount = window.cv.countNonZero(mask);
  
  src1.delete(); src2.delete(); gray1.delete(); gray2.delete();
  kp1.delete(); kp2.delete(); des1.delete(); des2.delete();
  bf.delete(); matches.delete(); srcMat.delete(); dstMat.delete();
  mask.delete(); F.delete(); lines.delete(); result.delete(); orb.delete();
  goodMatches.delete();
  
  return { resultImage: b64, inlierCount, F_matrix: fArray };
}

/**
 * Computes Essential Matrix and recovers pose
 */
export async function computeEssentialLocal(
  image1: string, 
  image2: string, 
  nFeatures: number, 
  ratio: number
): Promise<{ R: number[][], t: number[], inlierCount: number }> {
  const src1 = await base64ToMat(image1);
  const src2 = await base64ToMat(image2);
  
  const gray1 = new window.cv.Mat();
  const gray2 = new window.cv.Mat();
  window.cv.cvtColor(src1, gray1, window.cv.COLOR_RGBA2GRAY);
  window.cv.cvtColor(src2, gray2, window.cv.COLOR_RGBA2GRAY);
  
  const orb = new window.cv.ORB(nFeatures);
  const kp1 = new window.cv.KeyPointVector();
  const kp2 = new window.cv.KeyPointVector();
  const des1 = new window.cv.Mat();
  const des2 = new window.cv.Mat();
  
  orb.detectAndCompute(gray1, new window.cv.Mat(), kp1, des1);
  orb.detectAndCompute(gray2, new window.cv.Mat(), kp2, des2);
  
  const bf = new window.cv.BFMatcher(window.cv.NORM_HAMMING, false);
  const matches = new window.cv.DMatchVectorVector();
  bf.knnMatch(des1, des2, matches, 2);
  
  const srcPts: number[] = [];
  const dstPts: number[] = [];
  
  for (let i = 0; i < matches.size(); i++) {
    const m = matches.get(i);
    if (m.size() === 2) {
      const first = m.get(0);
      const second = m.get(1);
      if (first.distance < ratio * second.distance) {
        srcPts.push(kp1.get(first.queryIdx).pt.x);
        srcPts.push(kp1.get(first.queryIdx).pt.y);
        dstPts.push(kp2.get(first.trainIdx).pt.x);
        dstPts.push(kp2.get(first.trainIdx).pt.y);
      }
    }
  }

  // Camera intrinsics (approximated as in python demo if not provided)
  const f = Math.max(src1.cols, src1.rows) * 1.2;
  const K = window.cv.matFromArray(3, 3, window.cv.CV_64F, [
    f, 0, src1.cols / 2,
    0, f, src1.rows / 2,
    0, 0, 1
  ]);

  const srcMat = window.cv.matFromArray(srcPts.length / 2, 1, window.cv.CV_32FC2, srcPts);
  const dstMat = window.cv.matFromArray(dstPts.length / 2, 1, window.cv.CV_32FC2, dstPts);
  const mask = new window.cv.Mat();

  // Workaround for missing findEssentialMat: E = K' * F * K
  const F = window.cv.findFundamentalMat(srcMat, dstMat, window.cv.FM_RANSAC || 8, 1.0, 0.999, mask);
  const E = new window.cv.Mat();
  const KT = K.transpose();
  window.cv.gemm(KT, F, 1, new window.cv.Mat(), 0, E); // KT * F
  const E_final = new window.cv.Mat();
  window.cv.gemm(E, K, 1, new window.cv.Mat(), 0, E_final); // (KT * F) * K

  const R = new window.cv.Mat();
  const t = new window.cv.Mat();
  window.cv.recoverPose(E_final, srcMat, dstMat, K, R, t, mask);

  const resultR = [
    [R.doubleAt(0, 0), R.doubleAt(0, 1), R.doubleAt(0, 2)],
    [R.doubleAt(1, 0), R.doubleAt(1, 1), R.doubleAt(1, 2)],
    [R.doubleAt(2, 0), R.doubleAt(2, 1), R.doubleAt(2, 2)]
  ];

  const resultT = [t.doubleAt(0, 0), t.doubleAt(1, 0), t.doubleAt(2, 0)];
  const inlierCount = window.cv.countNonZero(mask);

  src1.delete(); src2.delete(); gray1.delete(); gray2.delete(); kp1.delete(); kp2.delete(); 
  des1.delete(); des2.delete(); bf.delete(); matches.delete(); srcMat.delete(); dstMat.delete(); 
  mask.delete(); F.delete(); E.delete(); E_final.delete(); KT.delete(); K.delete(); R.delete(); t.delete(); orb.delete();

  return { R: resultR, t: resultT, inlierCount };
  }

/**
 * Triangulates 3D points
 */
export async function computeTriangulationLocal(
  image1: string, 
  image2: string, 
  nFeatures: number, 
  ratio: number
): Promise<{ points3d: number[][], cam2_pos: number[], cam2: { R: number[][], t: number[] } }> {
  const { R, t } = await computeEssentialLocal(image1, image2, nFeatures, ratio);
  
  // Need to re-detect for triangulation or pass them along
  // For simplicity we'll just run a partial version here
  const src1 = await base64ToMat(image1);
  const src2 = await base64ToMat(image2);
  const gray1 = new window.cv.Mat();
  const gray2 = new window.cv.Mat();
  window.cv.cvtColor(src1, gray1, window.cv.COLOR_RGBA2GRAY);
  window.cv.cvtColor(src2, gray2, window.cv.COLOR_RGBA2GRAY);
  
  const orb = new window.cv.ORB(nFeatures);
  const kp1 = new window.cv.KeyPointVector();
  const kp2 = new window.cv.KeyPointVector();
  const des1 = new window.cv.Mat();
  const des2 = new window.cv.Mat();
  orb.detectAndCompute(gray1, new window.cv.Mat(), kp1, des1);
  orb.detectAndCompute(gray2, new window.cv.Mat(), kp2, des2);
  
  const bf = new window.cv.BFMatcher(window.cv.NORM_HAMMING, false);
  const matches = new window.cv.DMatchVectorVector();
  bf.knnMatch(des1, des2, matches, 2);
  
  const srcPts: number[] = [];
  const dstPts: number[] = [];
  for (let i = 0; i < matches.size(); i++) {
    const m = matches.get(i);
    if (m.size() === 2) {
      const first = m.get(0);
      if (first.distance < ratio * m.get(1).distance) {
        srcPts.push(kp1.get(first.queryIdx).pt.x);
        srcPts.push(kp1.get(first.queryIdx).pt.y);
        dstPts.push(kp2.get(first.trainIdx).pt.x);
        dstPts.push(kp2.get(first.trainIdx).pt.y);
      }
    }
  }

  const f = Math.max(src1.cols, src1.rows) * 1.2;
  const K = window.cv.matFromArray(3, 3, window.cv.CV_64F, [
    f, 0, src1.cols / 2,
    0, f, src1.rows / 2,
    0, 0, 1
  ]);

  const P1 = window.cv.matFromArray(3, 4, window.cv.CV_64F, [
    f, 0, src1.cols / 2, 0,
    0, f, src1.rows / 2, 0,
    0, 0, 1, 0
  ]);

  const Rt2 = window.cv.matFromArray(3, 4, window.cv.CV_64F, [
    R[0][0], R[0][1], R[0][2], t[0],
    R[1][0], R[1][1], R[1][2], t[1],
    R[2][0], R[2][1], R[2][2], t[2]
  ]);
  
  const P2 = new window.cv.Mat();
  window.cv.gemm(K, Rt2, 1, new window.cv.Mat(), 0, P2);

  // Prepare points for triangulation: 2xN float matrix
  // Row 1: x1, x2, x3...
  // Row 2: y1, y2, y3...
  const sPtsX = [], sPtsY = [], dPtsX = [], dPtsY = [];
  for (let i = 0; i < srcPts.length; i += 2) {
    sPtsX.push(srcPts[i]); sPtsY.push(srcPts[i+1]);
    dPtsX.push(dstPts[i]); dPtsY.push(dstPts[i+1]);
  }
  const srcMat = window.cv.matFromArray(2, sPtsX.length, window.cv.CV_32F, [...sPtsX, ...sPtsY]);
  const dstMat = window.cv.matFromArray(2, dPtsX.length, window.cv.CV_32F, [...dPtsX, ...dPtsY]);

  const points4d = new window.cv.Mat();
  window.cv.triangulatePoints(P1, P2, srcMat, dstMat, points4d);
  
  const points3d: number[][] = [];
  for (let i = 0; i < points4d.cols; i++) {
    const w = points4d.data32F[i + 3 * points4d.cols];
    const x = points4d.data32F[i] / w;
    const y = points4d.data32F[i + points4d.cols] / w;
    const z = points4d.data32F[i + 2 * points4d.cols] / w;
    
    if (z > 0 && z < 50) { // filter points behind camera and far outliers
      points3d.push([x, y, z]);
    }
  }

  // cam2_pos = -R^T * t
  // RT = R'
  const RT = new window.cv.Mat(3, 3, window.cv.CV_64F);
  for(let i=0; i<3; i++) for(let j=0; j<3; j++) RT.setDoubleAt(i, j, R[j][i]);
  
  const negT = new window.cv.Mat(3, 1, window.cv.CV_64F);
  negT.setDoubleAt(0, 0, -t[0]);
  negT.setDoubleAt(1, 0, -t[1]);
  negT.setDoubleAt(2, 0, -t[2]);
  
  const c2PosMat = new window.cv.Mat();
  window.cv.gemm(RT, negT, 1, new window.cv.Mat(), 0, c2PosMat);
  const cam2Pos = [c2PosMat.doubleAt(0, 0), c2PosMat.doubleAt(1, 0), c2PosMat.doubleAt(2, 0)];

  src1.delete(); src2.delete(); gray1.delete(); gray2.delete();
  kp1.delete(); kp2.delete(); des1.delete(); des2.delete();
  bf.delete(); matches.delete(); K.delete(); P1.delete(); Rt2.delete();
  P2.delete(); srcMat.delete(); dstMat.delete(); points4d.delete(); orb.delete();
  RT.delete(); negT.delete(); c2PosMat.delete();

  return { points3d, cam2_pos: cam2Pos, cam2: { R, t } };
}

/**
 * Computes Convolution vs Correlation
 */
export async function convVsCorrLocal(
  image: string, 
  kernel: number[][]
): Promise<{ convolution: string, correlation: string }> {
  const src = await base64ToMat(image);
  const dstCorr = new window.cv.Mat();
  const dstConv = new window.cv.Mat();
  
  const rows = kernel.length;
  const cols = kernel[0].length;
  const kernelMat = window.cv.matFromArray(rows, cols, window.cv.CV_32F, kernel.flat());
  
  // Correlation is standard filter2D
  window.cv.filter2D(src, dstCorr, window.cv.CV_8U, kernelMat, new window.cv.Point(-1, -1), 0, window.cv.BORDER_DEFAULT);
  
  // Convolution is filter2D with flipped kernel
  const flippedKernel = new window.cv.Mat();
  window.cv.flip(kernelMat, flippedKernel, -1); // flip both axes
  window.cv.filter2D(src, dstConv, window.cv.CV_8U, flippedKernel, new window.cv.Point(-1, -1), 0, window.cv.BORDER_DEFAULT);
  
  const correlation = matToBase64(dstCorr);
  const convolution = matToBase64(dstConv);
  
  src.delete(); dstCorr.delete(); dstConv.delete();
  kernelMat.delete(); flippedKernel.delete();
  
  return { convolution, correlation };
}
