export const getPosts = async (req, res, next) => {
  const posts = [
    {
      id: 1,
      title: 'Hello World!',
      body: 'This is a hello world post',
    },
    {
      id: 2,
      title: 'Another Post!',
      body: 'This is a another post',
    },
  ];

  return res.status(200).json({
    data: {
      success: true,
      posts,
    },
  });
};
