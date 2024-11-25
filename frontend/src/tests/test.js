export const tasks = [
  {
    id: 1,
    project_id: 101,
    user_uid: 'user1',
    title: 'Implement new feature',
    description: '<p>Add a new feature to the application that allows users to upload and share images. The feature should include the following:</p><ul><li>An upload interface where users can select images from their local device</li><li>Support for common image formats like JPG, PNG, GIF</li><li>Ability to add a caption and description to each uploaded image</li><li>A gallery view to display all uploaded images with their captions</li><li>Option to share images via social media or generate a shareable link</li></ul><p>The user interface should be intuitive and user-friendly, following best practices for image upload and gallery display. Proper validation should be implemented to handle errors and prevent upload of unsupported file types or excessively large files.</p><p>Additionally, consider implementing features like image compression, thumbnail generation, and lazy loading to optimize performance and improve the user experience.</p><p>Refer to the project requirements document for more detailed specifications and acceptance criteria.[1][2][3]</p>',
    status: 0, // e.g., 1 for 'open', 2 for 'in progress', 3 for 'done'
    priority: 1, // e.g., 1 for 'low', 2 for 'medium', 3 for 'high'
    assignee: {
      name: 'John Doe',
      assignee_id: 'user2'
    },
    reporter: {
      name: 'Jane Smith',
      reporter_id: 'user3'
    },
    created_at: '2021-05-31T00:00:00Z',
    updated_at: '2021-06-07T00:00:00Z'// Unix timestamp (June 7, 2021)
  },
  {
    id: 2,
    project_id: 102,
    user_uid: 'user4',
    title: 'Fix critical bug',
    description: '<p>Resolve a critical bug in the application that causes data loss when users attempt to save their work. The bug appears to be related to a race condition in the data synchronization process.</p><p>Steps to reproduce:</p><ol><li>Open the application and create a new document</li><li>Enter some data into the document</li><li>Attempt to save the document by clicking the "Save" button</li><li>Observe that the data is lost, and the document is blank after saving</li></ol><p>This issue is causing significant frustration for our users and needs to be addressed as a top priority. Investigate the root cause of the bug and implement a fix that ensures data integrity and prevents data loss during the save operation.</p><p>Refer to the bug report and related logs in the issue tracker for more details and additional context.[4][5]</p>',
    status: 2,
    priority: 2,
    assignee: {
      name: 'Bob Johnson',
      assignee_id: 'user5'
    },
    reporter: {
      name: 'Alice Williams',
      reporter_id: 'user6'
    },
    created_at: '2021-05-31T00:00:00Z',
    updated_at: '2021-06-07T00:00:00Z'// Unix timestamp (June 7, 2021)
  },
  {
    id: 3,
    project_id: 103,
    user_uid: 'user7',
    title: 'Improve performance',
    description: '<p>The application is experiencing performance issues, particularly during peak usage hours. Users have reported slow load times, laggy interactions, and occasional freezes or crashes.</p><p>Conduct a thorough performance audit and identify bottlenecks in the application\'s code, data fetching, and rendering processes. Implement optimizations such as:</p><ul><li>Code splitting and lazy loading to reduce initial bundle size</li><li>Memoization and caching strategies to minimize redundant computations</li><li>Optimizing data fetching and minimizing unnecessary network requests</li><li>Leveraging techniques like virtualization and windowing for large lists or grids</li><li>Profiling and optimizing resource-intensive operations or components</li></ul><p>Additionally, consider implementing performance monitoring tools to track and analyze the application\'s performance metrics in real-time, allowing for proactive identification and resolution of performance issues.</p><p>Refer to the performance reports and user feedback in the issue tracker for more specific details and prioritization.[6][7][8]</p>',
    status: 1,
    priority: 0,
    assignee: {
      name: 'Emily Wilson',
      assignee_id: 'user8'
    },
    reporter: {
      name: 'David Thompson',
      reporter_id: 'user9'
    },
    created_at: '2021-05-31T00:00:00Z',
    updated_at: '2021-06-07T00:00:00Z'// Unix timestamp (June 7, 2021)
  }
  // Add more task objects as needed
];
