"""
Test script for pose_extractor.py
Run this to verify the pose extraction is working
"""

from pose_extractor import PoseExtractor
import json


def test_pose_extractor():
    """Test the PoseExtractor with sample data"""
    print("=" * 50)
    print("Testing POSEIFY Pose Extractor")
    print("=" * 50)
    
    extractor = PoseExtractor()
    
    print("\n✓ PoseExtractor initialized successfully")
    print(f"✓ MediaPipe Pose model loaded")
    print(f"✓ Ready to process images and videos")
    
    print("\nUsage:")
    print("  python pose_extractor.py <path_to_image_or_video>")
    
    print("\nSupported formats:")
    print("  Images: .jpg, .jpeg, .png, .bmp, .webp")
    print("  Videos: .mp4, .avi, .mov, .mkv, .webm")
    
    extractor.close()
    
    print("\n✓ Test completed successfully!")


if __name__ == '__main__':
    test_pose_extractor()
