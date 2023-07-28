type Post = {
  id?: string;
  _type: string;
  parent_id: string;
  title: string;
  author: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};

type HookForm = {
  _selectedPost?: Post;
  _inputPost?: Post;
};
