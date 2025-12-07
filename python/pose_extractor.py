#!/usr/bin/env python3
"""
Pose Extractor using MediaPipe
Extracts pose landmarks from images and videos
Outputs clean JSON with all 33 landmark coordinates
"""

import sys
import json
import cv2
import mediapipe as mp
import numpy as np
from pathlib import Path


class PoseExtractor:
    # MediaPipe Pose landmark names (33 landmarks)
    LANDMARK_NAMES = [
        'nose',
        'left_eye_inner',
        'left_eye',
        'left_eye_outer',
        'right_eye_inner',
        'right_eye',
        'right_eye_outer',
        'left_ear',
        'right_ear',
        'mouth_left',
        'mouth_right',
        'left_shoulder',
        'right_shoulder',
        'left_elbow',
        'right_elbow',
        'left_wrist',
        'right_wrist',
        'left_pinky',
        'right_pinky',
        'left_index',
        'right_index',
        'left_thumb',
        'right_thumb',
        'left_hip',
        'right_hip',
        'left_knee',
        'right_knee',
        'left_ankle',
        'right_ankle',
        'left_heel',
        'right_heel',
        'left_foot_index',
        'right_foot_index'
    ]

    def __init__(self):
        """Initialize MediaPipe Pose detector"""
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            static_image_mode=True,
            model_complexity=2,
            smooth_landmarks=False,
            enable_segmentation=False,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def extract_from_image(self, image_path):
        """
        Extract pose landmarks from a single image
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            dict: Pose data with named landmarks
        """
        try:
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not read image: {image_path}")

            # Convert BGR to RGB
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Process image
            results = self.pose.process(image_rgb)
            
            if not results.pose_landmarks:
                return {
                    'success': False,
                    'message': 'No pose detected in image',
                    'landmarks': []
                }
            
            # Extract landmarks with names
            landmarks = []
            for idx, landmark in enumerate(results.pose_landmarks.landmark):
                landmark_name = self.LANDMARK_NAMES[idx] if idx < len(self.LANDMARK_NAMES) else f'landmark_{idx}'
                landmarks.append({
                    'name': landmark_name,
                    'x': float(landmark.x),
                    'y': float(landmark.y),
                    'z': float(landmark.z),
                    'visibility': float(landmark.visibility)
                })
            
            return {
                'success': True,
                'type': 'image',
                'file': image_path,
                'landmarks': landmarks,
                'num_landmarks': len(landmarks),
                'image_dimensions': {
                    'width': image.shape[1],
                    'height': image.shape[0]
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': f'Failed to process image: {str(e)}',
                'landmarks': []
            }

    def extract_from_video(self, video_path, sample_rate=5):
        """
        Extract pose landmarks from a video
        
        Args:
            video_path (str): Path to the video file
            sample_rate (int): Process every nth frame
            
        Returns:
            dict: Pose data for multiple frames
        """
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError(f"Could not open video: {video_path}")
            
            fps = cap.get(cv2.CAP_PROP_FPS)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            frames_data = []
            frame_count = 0
            
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Process every nth frame
                if frame_count % sample_rate == 0:
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = self.pose.process(frame_rgb)
                    
                    if results.pose_landmarks:
                        landmarks = []
                        for landmark in results.pose_landmarks.landmark:
                            landmarks.append({
                                'x': landmark.x,
                                'y': landmark.y,
                                'z': landmark.z,
                                'visibility': landmark.visibility
                            })
                        
                        frames_data.append({
                            'frame_number': frame_count,
                            'timestamp': frame_count / fps,
                            'landmarks': landmarks
                        })
                
                frame_count += 1
            
            cap.release()
            
            return {
                'success': True,
                'type': 'video',
                'file': video_path,
                'video_info': {
                    'fps': fps,
                    'total_frames': total_frames,
                    'duration': total_frames / fps if fps > 0 else 0
                },
                'processed_frames': len(frames_data),
                'frames': frames_data
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'message': f'Failed to process video: {str(e)}'
            }

    def calculate_angles(self, landmarks):
        """
        Calculate joint angles from landmarks
        
        Args:
            landmarks (list): List of pose landmarks
            
        Returns:
            dict: Joint angles
        """
        # TODO: Implement angle calculation
        # Example: Calculate elbow angle, knee angle, etc.
        return {}

    def close(self):
        """Release resources"""
        self.pose.close()


def main():
    """Main function to run pose extraction from command line"""
    if len(sys.argv) < 2:
        print(json.dumps({
            'success': False,
            'error': 'No file path provided',
            'usage': 'python pose_extractor.py <image_or_video_path>'
        }))
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    # Check if file exists
    if not Path(file_path).exists():
        print(json.dumps({
            'success': False,
            'error': 'File not found',
            'file': file_path
        }))
        sys.exit(1)
    
    # Determine file type
    file_ext = Path(file_path).suffix.lower()
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.webp']
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    
    extractor = PoseExtractor()
    
    try:
        if file_ext in image_extensions:
            result = extractor.extract_from_image(file_path)
        elif file_ext in video_extensions:
            result = extractor.extract_from_video(file_path)
        else:
            result = {
                'success': False,
                'error': 'Unsupported file format',
                'supported_formats': image_extensions + video_extensions
            }
        
        print(json.dumps(result, indent=2))
        
    finally:
        extractor.close()


if __name__ == '__main__':
    main()
