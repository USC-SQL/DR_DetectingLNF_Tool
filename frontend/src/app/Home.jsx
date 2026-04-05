import { useState} from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Label } from './components/ui/label';
import { Upload, FileText, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [imageFile, setImageFile] = useState(null);
  const [promptFile, setPromptFile] = useState(null);
  const [image, setImage] = useState(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Backend functionality will be added later
    console.log('Image file:', imageFile);
    console.log('Prompt file:', promptFile);
    navigate('/lnf_result', {state: {image}}); //send the image 
  };


  return (
    <div className="size-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
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
                  placeholder="Robinhood, Apple, etc."
                  className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
              </div>
            </div>


            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!imageFile || !promptFile}
            >
              <Upload className="mr-2 size-4" />
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;