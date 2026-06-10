import React from 'react';
import { LessonSection } from '@/components/layout/LessonSection';
import { IntrinsicDemo } from '@/components/interactive/IntrinsicDemo';
import { ExtrinsicDemo } from '@/components/interactive/ExtrinsicDemo';
import { Callout } from '@/components/layout/Callout';
import { InlineMath } from 'react-katex';

export default function CameraModelPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-24 pb-20">
      <div className="text-center space-y-6 pt-12 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-2">
           <div className="h-px w-8 bg-slate-200" />
           <span className="text-[10px] font-sans font-bold text-slate-300 uppercase tracking-[0.4em]">Volume I // Part 03</span>
           <div className="h-px w-8 bg-slate-200" />
        </div>
        <h1 className="text-6xl font-serif font-medium text-slate-900 tracking-tight leading-tight italic">
          Camera Geometry
        </h1>
        <p className="text-sm font-sans text-slate-500 uppercase tracking-[0.4em] max-w-lg mx-auto">
          Projective Mapping from Euclidean Space to the Image Plane
        </p>
        <div className="h-px w-32 bg-indigo-900/10 mx-auto mt-8" />
      </div>

      <LessonSection title="The Pinhole Paradigm">
        <div className="space-y-8">
          <p>
            In computer vision, the transformation of the three-dimensional world onto a two-dimensional manifold is classically modeled via 
            the <em className="italic">Pinhole Camera Model</em>. This mathematical abstraction decomposes the projection into two essential components:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-2 w-1 h-1 rounded-full bg-indigo-900 shrink-0" />
                  <span className="text-base font-serif italic text-slate-700">
                    <strong className="not-italic font-sans font-bold uppercase tracking-widest text-[10px] text-indigo-900 mr-2">Extrinsics:</strong> 
                    Representing the rigid body transformation <InlineMath math="(R, t)" /> from world coordinates to the camera frame.
                  </span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-2 w-1 h-1 rounded-full bg-indigo-900 shrink-0" />
                  <span className="text-base font-serif italic text-slate-700">
                    <strong className="not-italic font-sans font-bold uppercase tracking-widest text-[10px] text-indigo-900 mr-2">Intrinsics:</strong> 
                    Defining the internal projection <InlineMath math="K" /> that maps 3D rays onto discrete pixel coordinates.
                  </span>
                </li>
              </ul>
            </div>
            <Callout title="Instructional Scope">
              This module explores the relationship between focal length <InlineMath math="f" /> and perspectival distortion, while visualizing the relative motion <InlineMath math="(R, t)" /> of the optical center.
            </Callout>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Intrinsic Calibration (K)">
        <p className="mb-12">
          The intrinsic matrix <em className="italic">K</em> encapsulates the internal geometry of the optical system. 
          Through the interactive plate below, observe how focal length and principal point offsets distort the projection.
        </p>
        <div className="my-12">
          <IntrinsicDemo />
        </div>
        <Callout title="Optical Magnification" type="tip">
          Increasing the focal parameters <InlineMath math="(f_x, f_y)" /> effectively narrows the viewing frustum, resulting in a linear magnification of the observed features.
        </Callout>
      </LessonSection>

      <LessonSection title={<>Extrinsic Orientation <InlineMath math="[R | t]" /></>}>
        <p className="mb-12">
          The extrinsic parameters define the camera&apos;s pose relative to a global coordinate system, enabling the transformation of world points into the local optical reference.
        </p>
        <div className="my-12">
          <ExtrinsicDemo />
        </div>
        <Callout title="The Optical Axis" type="info">
          In our convention, the Z-axis projects forward into the scene. For an object to remain within the visible frustum, its translation <InlineMath math="T_z" /> must remain positive relative to the camera origin.
        </Callout>
      </LessonSection>
    </div>
  );
}
