import { useState, useEffect } from 'react';
import { Heart, Plus, Tag, Image, FileText, Youtube, Link, Settings, User, X } from 'lucide-react';

// Sample initial content for the dopamine box
const initialContent = [
  { id: 1, type: 'note', content: 'You are doing amazing work. Keep it up!', tags: ['encouragement'] },
  { id: 2, type: 'note', content: 'Remember that time we went hiking and saw the double rainbow? That was magical!', tags: ['memory'] },
  { id: 3, type: 'image', content: '/api/placeholder/400/300', caption: 'Your favorite beach sunset', tags: ['peaceful'] },
  { id: 4, type: 'note', content: 'Your kindness makes a difference in so many lives.', tags: ['compliment'] },
  { id: 5, type: 'video', content: 'YouTube: Funny Dog Video', thumbnail: '/api/placeholder/400/225', tags: ['funny'] },
  { id: 6, type: 'note', content: 'You handled that difficult situation last week with such grace. I was impressed!', tags: ['compliment'] },
  { id: 7, type: 'link', content: 'https://example.com/inspirational-article', title: 'How Small Steps Lead to Big Changes', tags: ['inspirational'] },
  { id: 8, type: 'image', content: '/api/placeholder/400/300', caption: 'The artwork you created last summer', tags: ['creative'] },
  { id: 9, type: 'note', content: 'Your presentation skills have improved so much! You\'re a natural speaker.', tags: ['growth'] },
  { id: 10, type: 'note', content: 'Never forget how far you\'ve come. You\'ve overcome so much!', tags: ['perspective'] }
];

// Available tags for filtering
const availableTags = ['encouragement', 'memory', 'peaceful', 'compliment', 'funny', 'inspirational', 'creative', 'growth', 'perspective'];

export default function DopamineBox() {
  const [content, setContent] = useState(initialContent);
  const [currentItem, setCurrentItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showShareLink, setShowShareLink] = useState(false);
  const [animation, setAnimation] = useState('');
  const [friendMode, setFriendMode] = useState(false);
  
  // New state for form handling
  const [selectedContentType, setSelectedContentType] = useState('note');
  const [formInput, setFormInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [linkTitle, setLinkTitle] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [contentTags, setContentTags] = useState([]);
  const [caption, setCaption] = useState('');
  
  // Check if this is a shared link view
  useEffect(() => {
    if (window.location.hash === '#share') {
      setFriendMode(true);
      setShowAddForm(true);
    }
  }, []);

  // Get random item from the box
  const getDopamine = () => {
    // Filter content based on selected tags if any
    const filteredContent = selectedTags.length > 0
      ? content.filter(item => item.tags.some(tag => selectedTags.includes(tag)))
      : content;
    
    if (filteredContent.length === 0) {
      setCurrentItem({ type: 'note', content: 'No items match your current filters. Try different tags!' });
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredContent.length);
    setAnimation('animate-in');
    setTimeout(() => {
      setCurrentItem(filteredContent[randomIndex]);
      setAnimation('animate-out');
    }, 300);
  };

  // Toggle tag selection for filtering
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Toggle tag selection for content creation
  const toggleContentTag = (tag) => {
    if (contentTags.includes(tag)) {
      setContentTags(contentTags.filter(t => t !== tag));
    } else {
      setContentTags([...contentTags, tag]);
    }
  };

  // Reset current item
  useEffect(() => {
    if (selectedTags.length === 0 && currentItem && currentItem.content === 'No items match your current filters. Try different tags!') {
      setCurrentItem(null);
    }
  }, [selectedTags, currentItem]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle video link input
  const handleVideoInput = (e) => {
    const url = e.target.value;
    setFormInput(url);
    
    // Generate a thumbnail preview based on the type of video
    if (url.includes('youtube') || url.includes('youtu.be')) {
      setVideoThumbnail('/api/placeholder/400/225');
    } else if (url.includes('instagram')) {
      setVideoThumbnail('/api/placeholder/400/400');
    } else {
      setVideoThumbnail('/api/placeholder/400/300');
    }
  };

  // Save content to the box
  const saveContent = () => {
    if (!formInput && selectedContentType !== 'image') return;
    
    const newId = content.length > 0 ? Math.max(...content.map(item => item.id)) + 1 : 1;
    let newItem;
    
    switch (selectedContentType) {
      case 'note':
        newItem = {
          id: newId,
          type: 'note',
          content: formInput,
          tags: contentTags
        };
        break;
      case 'image':
        newItem = {
          id: newId,
          type: 'image',
          content: imagePreview || '/api/placeholder/400/300',
          caption: caption || 'My image',
          tags: contentTags
        };
        break;
      case 'video':
        newItem = {
          id: newId,
          type: 'video',
          content: formInput,
          thumbnail: videoThumbnail,
          tags: contentTags
        };
        break;
      case 'link':
        newItem = {
          id: newId,
          type: 'link',
          content: formInput,
          title: linkTitle || 'Interesting link',
          tags: contentTags
        };
        break;
      default:
        newItem = {
          id: newId,
          type: 'note',
          content: formInput,
          tags: contentTags
        };
    }
    
    setContent([...content, newItem]);
    
    // Reset form
    setFormInput('');
    setImagePreview(null);
    setLinkTitle('');
    setVideoThumbnail('');
    setContentTags([]);
    setCaption('');
    setShowAddForm(false);
    
    // Show confirmation
    alert('New item added to your dopamine box!');
  };

  // Render content based on type
  const renderContent = (item) => {
    if (!item) return null;

    switch (item.type) {
      case 'note':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <FileText className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <p className="text-gray-800 text-lg">{item.content}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1 justify-center">
                {item.tags.map(tag => (
                  <span key={tag} className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      case 'image':
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <img src={item.content} alt={item.caption} className="rounded-md mb-2" />
            <p className="text-gray-700 text-center">{item.caption}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1 justify-center">
                {item.tags.map(tag => (
                  <span key={tag} className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      case 'video':
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <div className="relative">
              <img src={item.thumbnail} alt="Video thumbnail" className="rounded-md" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <Youtube className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <p className="text-gray-700 text-center mt-2">{item.content}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1 justify-center">
                {item.tags.map(tag => (
                  <span key={tag} className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      case 'link':
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <Link className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-medium text-lg text-center mb-2">{item.title}</h3>
            <a href={item.content} className="text-blue-500 block text-center" target="_blank" rel="noopener noreferrer">
              {item.content}
            </a>
            {item.tags && item.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1 justify-center">
                {item.tags.map(tag => (
                  <span key={tag} className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return <p>Unknown content type</p>;
    }
  };

  // Render form based on selected content type
  const renderForm = () => {
    switch (selectedContentType) {
      case 'note':
        return (
          <div>
            <textarea 
              className="w-full border rounded p-3 h-24 mb-4" 
              placeholder={friendMode ? "Write something positive to brighten their day..." : "Write something positive..."}
              value={formInput}
              onChange={(e) => setFormInput(e.target.value)}
            ></textarea>
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="hidden" 
                id="image-upload" 
              />
              <label 
                htmlFor="image-upload" 
                className="cursor-pointer block"
              >
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="mx-auto max-h-40 rounded" 
                    />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setImagePreview(null);
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Image className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload an image</p>
                  </div>
                )}
              </label>
            </div>
            <input
              type="text"
              placeholder="Add a caption"
              className="w-full border rounded p-2"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
        );
      case 'video':
        return (
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Paste YouTube, Instagram, or TikTok link" 
              className="w-full border rounded p-2" 
              value={formInput}
              onChange={handleVideoInput}
            />
            {videoThumbnail && (
              <div className="relative max-w-xs mx-auto">
                <img 
                  src={videoThumbnail} 
                  alt="Video thumbnail preview" 
                  className="rounded" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <Youtube className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'link':
        return (
          <div className="space-y-4">
            <input 
              type="url" 
              placeholder="https://example.com" 
              className="w-full border rounded p-2" 
              value={formInput}
              onChange={(e) => setFormInput(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Link title" 
              className="w-full border rounded p-2" 
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
            />
          </div>
        );
      default:
        return <p>Select a content type</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center py-8 px-4">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-pink-500" />
          <h1 className="text-2xl font-bold text-gray-800">Dopamine Box</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowShareLink(!showShareLink)}
            className="bg-white text-blue-500 p-2 rounded-full shadow hover:bg-blue-50"
          >
            <User className="w-5 h-5" />
          </button>
          <button 
            onClick={() => {}}
            className="bg-white text-gray-600 p-2 rounded-full shadow hover:bg-gray-50"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Friend share link panel */}
      {showShareLink && (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="font-medium mb-2">Share with friends</h3>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={window.location.href + "#share"} 
                readOnly
                className="flex-1 border rounded p-2 text-sm bg-gray-50"
              />
              <button 
                className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href + "#share");
                  alert("Link copied to clipboard!");
                }}
              >
                Copy
              </button>
            </div>
            
            <button 
              className="bg-green-500 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Add to my Dopamine Box",
                    text: "Help fill my Dopamine Box with positive notes and encouragement!",
                    url: window.location.href + "#share"
                  })
                  .then(() => console.log("Shared successfully"))
                  .catch((error) => console.log("Error sharing:", error));
                } else {
                  alert("Web Share API not supported on this browser. You can copy the link instead.");
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share with native dialog
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Anyone with this link can add positive notes to your dopamine box
          </p>
        </div>
      )}

      {/* Tag filters */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="font-medium mb-2">Filter by tags</h3>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                  : 'bg-gray-100 text-gray-700 border border-transparent'
              }`}
            >
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className={`min-h-64 flex items-center justify-center mb-8 transition-all duration-300 ${animation}`}>
        {currentItem ? (
          renderContent(currentItem)
        ) : (
          <div className="text-center text-gray-500">
            <p className="mb-2">Press the button below to get a dose of dopamine</p>
            <Heart className="w-12 h-12 text-pink-200 mx-auto animate-pulse" />
          </div>
        )}
      </div>

      {/* Get Dopamine button */}
      <button
        onClick={getDopamine}
        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 flex items-center gap-2"
      >
        <Heart className="w-5 h-5" />
        Get Dopamine
      </button>

      {/* Add new content button */}
      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-white text-gray-800 p-3 rounded-full shadow-md hover:bg-gray-50"
        >
          <Plus className="w-6 h-6" />
        </button>
        <span className="text-sm text-gray-500 mt-2">Add to your box</span>
      </div>

      {/* Add form (with full functionality) */}
      {showAddForm && (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mt-4">
          <h3 className="font-medium mb-4">
            {friendMode 
              ? "Add a positive note to your friend's dopamine box" 
              : "Add to your dopamine box"}
          </h3>
          
          <div className="flex gap-3 mb-4">
            <button 
              className={`flex-1 rounded p-3 text-center ${selectedContentType === 'note' ? 'bg-purple-100' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setSelectedContentType('note')}
            >
              <FileText className={`w-5 h-5 mx-auto mb-1 ${selectedContentType === 'note' ? 'text-purple-500' : ''}`} />
              <span className="text-sm">Note</span>
            </button>
            <button 
              className={`flex-1 rounded p-3 text-center ${selectedContentType === 'image' ? 'bg-purple-100' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setSelectedContentType('image')}
            >
              <Image className={`w-5 h-5 mx-auto mb-1 ${selectedContentType === 'image' ? 'text-purple-500' : ''}`} />
              <span className="text-sm">Image</span>
            </button>
            <button 
              className={`flex-1 rounded p-3 text-center ${selectedContentType === 'video' ? 'bg-purple-100' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setSelectedContentType('video')}
            >
              <Youtube className={`w-5 h-5 mx-auto mb-1 ${selectedContentType === 'video' ? 'text-purple-500' : ''}`} />
              <span className="text-sm">Video</span>
            </button>
            <button 
              className={`flex-1 rounded p-3 text-center ${selectedContentType === 'link' ? 'bg-purple-100' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setSelectedContentType('link')}
            >
              <Link className={`w-5 h-5 mx-auto mb-1 ${selectedContentType === 'link' ? 'text-purple-500' : ''}`} />
              <span className="text-sm">Link</span>
            </button>
          </div>
          
          {/* Dynamic form based on selected content type */}
          {renderForm()}
          
          {/* Tag selection for content */}
          <div className="mt-4 mb-4">
            <h4 className="text-sm font-medium mb-2">Add tags</h4>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleContentTag(tag)}
                  className={`px-2 py-1 rounded-full text-xs ${
                    contentTags.includes(tag)
                      ? 'bg-purple-100 text-purple-700 border border-purple-300'
                      : 'bg-gray-100 text-gray-700 border border-transparent'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
            <button 
              onClick={saveContent}
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={(!formInput && selectedContentType !== 'image') || (selectedContentType === 'image' && !imagePreview)}
            >
              Save to box
            </button>
          </div>
        </div>
      )}
    </div>
  );
}