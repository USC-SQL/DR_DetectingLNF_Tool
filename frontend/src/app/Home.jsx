import { useState} from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Label } from './components/ui/label';
import { Upload, FileText, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [imageFile, setImageFile] = useState(null);
  const [promptFile, setPromptFile] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]))
    }
  };

  const handlePromptChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPromptFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Backend functionality will be added later
    // console.log('Image file:', imageFile);
    // console.log('Prompt file:', promptFile);
    // navigate('/lnf_result', {state: {image}}); //send the image 
    if(!imageFile || !promptFile){
      return;
    }

    try{
      setLoading(true);
      //creates a POST request to backend
      const formData = new FormData();
      formData.append('image_file', imageFile);
      formData.append('prompt_file', promptFile);
      formData.append('subject_name', subjectName);

       //send request to backend
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if(!response.ok){
        throw new Error(`Request failed: ${response.status}`);
      }

      //parse backend response
      const data = await response.json();
      console.log('Backend response:' , data);

      //go to next page
      navigate('/lnf_result',{
        state:{
          image,
          result: data,
        },
      });
    }catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload files');
    } finally {
      setLoading(false);
    }
  };

  
 
  return (
    <div className="size-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">LNF Analyzer</CardTitle>
          <CardDescription>
            Upload an image and a prompt file to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image File Input */}
            <div className="space-y-2">
              <Label htmlFor="image-upload" className="flex items-center gap-2">
                <Image className="size-4" />
                Image File
              </Label>
              <div className="relative">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
              </div>
              {imageFile && (
                <p className="text-sm text-gray-600">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>

            {/* Prompt File Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt-upload" className="flex items-center gap-2">
                <FileText className="size-4" />
                Prompt File
              </Label>
              <div className="relative">
                <input
                  id="prompt-upload"
                  type="file"
                  accept=".txt,.md,.json"
                  onChange={handlePromptChange}
                  className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
              </div>
              {promptFile && (
                <p className="text-sm text-gray-600">
                  Selected: {promptFile.name}
                </p>
              )}
            </div>

            {/* Subject name */}
            <div className="space-y-2">
                <label htmlFor="subjectName">Enter Subject Name</label>
              <div className="relative">
                <input
                  id="subjectName"
                  type="text"
                  value={subjectName}
                  onChange={ (e) => setSubjectName(e.target.value)}
                  placeholder="Robinhood, Apple, etc."
                  className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
              </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="size-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                Analyzing...
              </div>
            )}


            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!imageFile || !promptFile || loading}
            >
              <Upload className="mr-2 size-4" />
              {/* Submit */}
              {loading ? 'Analyzing...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;