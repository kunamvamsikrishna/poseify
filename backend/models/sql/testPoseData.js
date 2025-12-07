/**
 * Test script for PoseData model
 * Run this to test inserting and querying pose data
 */

const PoseData = require('./PoseData');
const { sequelize } = require('../../db/sql');

// Sample MediaPipe landmarks data (33 landmarks)
const sampleLandmarks = [
  // Landmark 0: NOSE
  { x: 0.5123, y: 0.2845, z: -0.1234, visibility: 0.9987 },
  // Landmark 1: LEFT_EYE_INNER
  { x: 0.4876, y: 0.2456, z: -0.1456, visibility: 0.9965 },
  // Landmark 2: LEFT_EYE
  { x: 0.4654, y: 0.2398, z: -0.1523, visibility: 0.9978 },
  // Landmark 3: LEFT_EYE_OUTER
  { x: 0.4432, y: 0.2387, z: -0.1612, visibility: 0.9945 },
  // Landmark 4: RIGHT_EYE_INNER
  { x: 0.5376, y: 0.2478, z: -0.1445, visibility: 0.9972 },
  // Landmark 5: RIGHT_EYE
  { x: 0.5598, y: 0.2421, z: -0.1534, visibility: 0.9981 },
  // Landmark 6: RIGHT_EYE_OUTER
  { x: 0.5820, y: 0.2410, z: -0.1623, visibility: 0.9958 },
  // Landmark 7: LEFT_EAR
  { x: 0.3987, y: 0.2543, z: -0.1987, visibility: 0.9823 },
  // Landmark 8: RIGHT_EAR
  { x: 0.6265, y: 0.2565, z: -0.2012, visibility: 0.9834 },
  // Landmark 9: MOUTH_LEFT
  { x: 0.4765, y: 0.3654, z: -0.0987, visibility: 0.9912 },
  // Landmark 10: MOUTH_RIGHT
  { x: 0.5487, y: 0.3676, z: -0.0998, visibility: 0.9905 },
  // Landmark 11: LEFT_SHOULDER
  { x: 0.3456, y: 0.5234, z: -0.2345, visibility: 0.9987 },
  // Landmark 12: RIGHT_SHOULDER
  { x: 0.6796, y: 0.5287, z: -0.2398, visibility: 0.9991 },
  // Landmark 13: LEFT_ELBOW
  { x: 0.2345, y: 0.6543, z: -0.1234, visibility: 0.9954 },
  // Landmark 14: RIGHT_ELBOW
  { x: 0.7907, y: 0.6598, z: -0.1287, visibility: 0.9962 },
  // Landmark 15: LEFT_WRIST
  { x: 0.1876, y: 0.7234, z: -0.0876, visibility: 0.9876 },
  // Landmark 16: RIGHT_WRIST
  { x: 0.8376, y: 0.7298, z: -0.0923, visibility: 0.9889 },
  // Landmark 17: LEFT_PINKY
  { x: 0.1654, y: 0.7543, z: -0.0654, visibility: 0.9734 },
  // Landmark 18: RIGHT_PINKY
  { x: 0.8598, y: 0.7609, z: -0.0687, visibility: 0.9745 },
  // Landmark 19: LEFT_INDEX
  { x: 0.1765, y: 0.7498, z: -0.0765, visibility: 0.9812 },
  // Landmark 20: RIGHT_INDEX
  { x: 0.8487, y: 0.7565, z: -0.0798, visibility: 0.9823 },
  // Landmark 21: LEFT_THUMB
  { x: 0.1987, y: 0.7345, z: -0.0987, visibility: 0.9789 },
  // Landmark 22: RIGHT_THUMB
  { x: 0.8265, y: 0.7412, z: -0.1023, visibility: 0.9798 },
  // Landmark 23: LEFT_HIP
  { x: 0.4123, y: 0.8234, z: -0.1567, visibility: 0.9956 },
  // Landmark 24: RIGHT_HIP
  { x: 0.6129, y: 0.8287, z: -0.1612, visibility: 0.9963 },
  // Landmark 25: LEFT_KNEE
  { x: 0.3987, y: 1.0543, z: -0.0876, visibility: 0.9934 },
  // Landmark 26: RIGHT_KNEE
  { x: 0.6265, y: 1.0598, z: -0.0923, visibility: 0.9941 },
  // Landmark 27: LEFT_ANKLE
  { x: 0.4234, y: 1.2876, z: -0.0456, visibility: 0.9887 },
  // Landmark 28: RIGHT_ANKLE
  { x: 0.6012, y: 1.2934, z: -0.0489, visibility: 0.9895 },
  // Landmark 29: LEFT_HEEL
  { x: 0.4012, y: 1.3234, z: -0.0234, visibility: 0.9823 },
  // Landmark 30: RIGHT_HEEL
  { x: 0.6234, y: 1.3287, z: -0.0267, visibility: 0.9834 },
  // Landmark 31: LEFT_FOOT_INDEX
  { x: 0.4456, y: 1.3123, z: -0.0123, visibility: 0.9801 },
  // Landmark 32: RIGHT_FOOT_INDEX
  { x: 0.5790, y: 1.3176, z: -0.0156, visibility: 0.9812 }
];

async function testPoseDataModel() {
  console.log('='.repeat(60));
  console.log('Testing PoseData Model');
  console.log('='.repeat(60));

  try {
    // 1. Connect to database
    console.log('\n1. Connecting to database...');
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // 2. Sync model (create table if not exists)
    console.log('\n2. Syncing model...');
    await sequelize.sync({ alter: true });
    console.log('✓ Model synced');

    // 3. Test: Insert pose data using helper method
    console.log('\n3. Inserting sample pose data...');
    const poseData1 = await PoseData.createFromLandmarks(
      'image_001.jpg',
      sampleLandmarks,
      'Standing pose - front view'
    );
    console.log(`✓ Inserted pose data with ID: ${poseData1.id}`);

    // 4. Test: Insert another record with direct values
    console.log('\n4. Inserting another pose data record...');
    const poseData2 = await PoseData.create({
      image_id: 'image_002.jpg',
      nose_x: 0.5234,
      nose_y: 0.2987,
      nose_z: -0.1345,
      nose_visibility: 0.9976,
      left_shoulder_x: 0.3567,
      left_shoulder_y: 0.5432,
      left_shoulder_z: -0.2456,
      left_shoulder_visibility: 0.9989,
      right_shoulder_x: 0.6890,
      right_shoulder_y: 0.5489,
      right_shoulder_z: -0.2512,
      right_shoulder_visibility: 0.9992,
      summary: 'Sitting pose - side view'
    });
    console.log(`✓ Inserted pose data with ID: ${poseData2.id}`);

    // 5. Test: Query all records
    console.log('\n5. Querying all pose data records...');
    const allPoseData = await PoseData.findAll();
    console.log(`✓ Found ${allPoseData.length} records`);

    // 6. Test: Query by image_id
    console.log('\n6. Querying pose data by image_id...');
    const poseByImage = await PoseData.findOne({
      where: { image_id: 'image_001.jpg' }
    });
    console.log(`✓ Found pose data for image: ${poseByImage.image_id}`);
    console.log(`  - Nose position: (${poseByImage.nose_x}, ${poseByImage.nose_y}, ${poseByImage.nose_z})`);
    console.log(`  - Nose visibility: ${poseByImage.nose_visibility}`);

    // 7. Test: Convert to landmarks array
    console.log('\n7. Converting pose data to landmarks array...');
    const landmarksArray = poseByImage.toLandmarksArray();
    console.log(`✓ Converted to array with ${landmarksArray.length} landmarks`);
    console.log('  First landmark (nose):', landmarksArray[0]);
    console.log('  12th landmark (right_shoulder):', landmarksArray[12]);

    // 8. Test: Query with specific columns
    console.log('\n8. Querying specific landmark columns...');
    const shoulderData = await PoseData.findAll({
      attributes: [
        'id',
        'image_id',
        'left_shoulder_x',
        'left_shoulder_y',
        'left_shoulder_z',
        'right_shoulder_x',
        'right_shoulder_y',
        'right_shoulder_z'
      ]
    });
    console.log(`✓ Retrieved shoulder data for ${shoulderData.length} records`);
    shoulderData.forEach(pose => {
      console.log(`  - ${pose.image_id}: Left(${pose.left_shoulder_x}, ${pose.left_shoulder_y}), Right(${pose.right_shoulder_x}, ${pose.right_shoulder_y})`);
    });

    // 9. Test: Update a record
    console.log('\n9. Updating pose data summary...');
    await poseData1.update({ summary: 'Updated: Standing pose - front view - high quality' });
    console.log('✓ Record updated successfully');

    // 10. Test: Count records
    console.log('\n10. Counting total pose data records...');
    const count = await PoseData.count();
    console.log(`✓ Total records: ${count}`);

    // 11. Display table info
    console.log('\n11. Table Information:');
    console.log('  - Table name: pose_data');
    console.log('  - Total columns: 135 (1 id + 1 image_id + 132 landmark fields + 1 summary + 1 created_at)');
    console.log('  - Landmark columns: 33 landmarks × 4 properties (x, y, z, visibility) = 132 columns');
    console.log('  - Indexes: image_id, created_at');

    console.log('\n' + '='.repeat(60));
    console.log('✓ All tests completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.error('Error details:', error.message);
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('\n✓ Database connection closed');
  }
}

// Run tests
if (require.main === module) {
  testPoseDataModel()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = testPoseDataModel;
