import slugify from 'slugify';

const generateSlug = (text) => {
    if(!text || typeof text !== 'string') {
        throw new Error('Invalid input: text must be a non-empty string');
    }
  return slugify(text, 
    {   lower: true,
        strict: true,
        trim: true,
        replacement: '-',
    }
  );
};

export default generateSlug;
