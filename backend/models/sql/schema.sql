-- PostgreSQL CREATE TABLE Statement for pose_data
-- This table stores all 33 MediaPipe Pose landmarks as individual columns
-- Each landmark has 4 properties: x, y, z, visibility

CREATE TABLE IF NOT EXISTS pose_data (
    -- Primary Key
    id SERIAL PRIMARY KEY,
    
    -- Foreign Key Reference
    image_id VARCHAR(255) NOT NULL,
    
    -- Landmark 0: NOSE
    nose_x REAL,
    nose_y REAL,
    nose_z REAL,
    nose_visibility REAL,
    
    -- Landmark 1: LEFT_EYE_INNER
    left_eye_inner_x REAL,
    left_eye_inner_y REAL,
    left_eye_inner_z REAL,
    left_eye_inner_visibility REAL,
    
    -- Landmark 2: LEFT_EYE
    left_eye_x REAL,
    left_eye_y REAL,
    left_eye_z REAL,
    left_eye_visibility REAL,
    
    -- Landmark 3: LEFT_EYE_OUTER
    left_eye_outer_x REAL,
    left_eye_outer_y REAL,
    left_eye_outer_z REAL,
    left_eye_outer_visibility REAL,
    
    -- Landmark 4: RIGHT_EYE_INNER
    right_eye_inner_x REAL,
    right_eye_inner_y REAL,
    right_eye_inner_z REAL,
    right_eye_inner_visibility REAL,
    
    -- Landmark 5: RIGHT_EYE
    right_eye_x REAL,
    right_eye_y REAL,
    right_eye_z REAL,
    right_eye_visibility REAL,
    
    -- Landmark 6: RIGHT_EYE_OUTER
    right_eye_outer_x REAL,
    right_eye_outer_y REAL,
    right_eye_outer_z REAL,
    right_eye_outer_visibility REAL,
    
    -- Landmark 7: LEFT_EAR
    left_ear_x REAL,
    left_ear_y REAL,
    left_ear_z REAL,
    left_ear_visibility REAL,
    
    -- Landmark 8: RIGHT_EAR
    right_ear_x REAL,
    right_ear_y REAL,
    right_ear_z REAL,
    right_ear_visibility REAL,
    
    -- Landmark 9: MOUTH_LEFT
    mouth_left_x REAL,
    mouth_left_y REAL,
    mouth_left_z REAL,
    mouth_left_visibility REAL,
    
    -- Landmark 10: MOUTH_RIGHT
    mouth_right_x REAL,
    mouth_right_y REAL,
    mouth_right_z REAL,
    mouth_right_visibility REAL,
    
    -- Landmark 11: LEFT_SHOULDER
    left_shoulder_x REAL,
    left_shoulder_y REAL,
    left_shoulder_z REAL,
    left_shoulder_visibility REAL,
    
    -- Landmark 12: RIGHT_SHOULDER
    right_shoulder_x REAL,
    right_shoulder_y REAL,
    right_shoulder_z REAL,
    right_shoulder_visibility REAL,
    
    -- Landmark 13: LEFT_ELBOW
    left_elbow_x REAL,
    left_elbow_y REAL,
    left_elbow_z REAL,
    left_elbow_visibility REAL,
    
    -- Landmark 14: RIGHT_ELBOW
    right_elbow_x REAL,
    right_elbow_y REAL,
    right_elbow_z REAL,
    right_elbow_visibility REAL,
    
    -- Landmark 15: LEFT_WRIST
    left_wrist_x REAL,
    left_wrist_y REAL,
    left_wrist_z REAL,
    left_wrist_visibility REAL,
    
    -- Landmark 16: RIGHT_WRIST
    right_wrist_x REAL,
    right_wrist_y REAL,
    right_wrist_z REAL,
    right_wrist_visibility REAL,
    
    -- Landmark 17: LEFT_PINKY
    left_pinky_x REAL,
    left_pinky_y REAL,
    left_pinky_z REAL,
    left_pinky_visibility REAL,
    
    -- Landmark 18: RIGHT_PINKY
    right_pinky_x REAL,
    right_pinky_y REAL,
    right_pinky_z REAL,
    right_pinky_visibility REAL,
    
    -- Landmark 19: LEFT_INDEX
    left_index_x REAL,
    left_index_y REAL,
    left_index_z REAL,
    left_index_visibility REAL,
    
    -- Landmark 20: RIGHT_INDEX
    right_index_x REAL,
    right_index_y REAL,
    right_index_z REAL,
    right_index_visibility REAL,
    
    -- Landmark 21: LEFT_THUMB
    left_thumb_x REAL,
    left_thumb_y REAL,
    left_thumb_z REAL,
    left_thumb_visibility REAL,
    
    -- Landmark 22: RIGHT_THUMB
    right_thumb_x REAL,
    right_thumb_y REAL,
    right_thumb_z REAL,
    right_thumb_visibility REAL,
    
    -- Landmark 23: LEFT_HIP
    left_hip_x REAL,
    left_hip_y REAL,
    left_hip_z REAL,
    left_hip_visibility REAL,
    
    -- Landmark 24: RIGHT_HIP
    right_hip_x REAL,
    right_hip_y REAL,
    right_hip_z REAL,
    right_hip_visibility REAL,
    
    -- Landmark 25: LEFT_KNEE
    left_knee_x REAL,
    left_knee_y REAL,
    left_knee_z REAL,
    left_knee_visibility REAL,
    
    -- Landmark 26: RIGHT_KNEE
    right_knee_x REAL,
    right_knee_y REAL,
    right_knee_z REAL,
    right_knee_visibility REAL,
    
    -- Landmark 27: LEFT_ANKLE
    left_ankle_x REAL,
    left_ankle_y REAL,
    left_ankle_z REAL,
    left_ankle_visibility REAL,
    
    -- Landmark 28: RIGHT_ANKLE
    right_ankle_x REAL,
    right_ankle_y REAL,
    right_ankle_z REAL,
    right_ankle_visibility REAL,
    
    -- Landmark 29: LEFT_HEEL
    left_heel_x REAL,
    left_heel_y REAL,
    left_heel_z REAL,
    left_heel_visibility REAL,
    
    -- Landmark 30: RIGHT_HEEL
    right_heel_x REAL,
    right_heel_y REAL,
    right_heel_z REAL,
    right_heel_visibility REAL,
    
    -- Landmark 31: LEFT_FOOT_INDEX
    left_foot_index_x REAL,
    left_foot_index_y REAL,
    left_foot_index_z REAL,
    left_foot_index_visibility REAL,
    
    -- Landmark 32: RIGHT_FOOT_INDEX
    right_foot_index_x REAL,
    right_foot_index_y REAL,
    right_foot_index_z REAL,
    right_foot_index_visibility REAL,
    
    -- Summary/Metadata
    summary TEXT,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pose_data_image_id ON pose_data(image_id);
CREATE INDEX IF NOT EXISTS idx_pose_data_created_at ON pose_data(created_at);

-- Add comments
COMMENT ON TABLE pose_data IS 'Stores all 33 MediaPipe Pose landmarks as individual columns';
COMMENT ON COLUMN pose_data.id IS 'Auto-incrementing primary key';
COMMENT ON COLUMN pose_data.image_id IS 'Reference to the image/video source';
COMMENT ON COLUMN pose_data.summary IS 'Optional summary or notes about this pose data';

-- Sample query to verify table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'pose_data' 
-- ORDER BY ordinal_position;
