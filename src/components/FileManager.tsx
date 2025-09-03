import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Folder, 
  File, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  Plus,
  Home,
  ChevronRight,
  Search,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileItem {
  name: string;
  type: 'file' | 'directory';
  size: number;
  modified: string;
  permissions: string;
}

export function FileManager() {
  const [currentPath, setCurrentPath] = useState('/home/dayz');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  // Mock file data
  const files: FileItem[] = [
    { name: '..', type: 'directory', size: 0, modified: '', permissions: 'drwxr-xr-x' },
    { name: 'serverDZ.cfg', type: 'file', size: 2048, modified: '2024-01-15 14:30', permissions: '-rw-r--r--' },
    { name: 'logs', type: 'directory', size: 0, modified: '2024-01-15 12:00', permissions: 'drwxr-xr-x' },
    { name: 'mpmissions', type: 'directory', size: 0, modified: '2024-01-14 18:45', permissions: 'drwxr-xr-x' },
    { name: 'profiles', type: 'directory', size: 0, modified: '2024-01-15 09:15', permissions: 'drwxr-xr-x' },
    { name: 'battleye', type: 'directory', size: 0, modified: '2024-01-13 16:20', permissions: 'drwxr-xr-x' },
    { name: 'storage_1', type: 'directory', size: 0, modified: '2024-01-15 13:45', permissions: 'drwxr-xr-x' },
    { name: 'init.c', type: 'file', size: 15420, modified: '2024-01-14 11:30', permissions: '-rw-r--r--' },
    { name: 'globals.xml', type: 'file', size: 45600, modified: '2024-01-13 20:15', permissions: '-rw-r--r--' },
    { name: 'types.xml', type: 'file', size: 234560, modified: '2024-01-12 14:00', permissions: '-rw-r--r--' },
  ];

  const pathParts = currentPath.split('/').filter(Boolean);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '-';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'directory') {
      if (file.name === '..') {
        // Go up one directory
        const newPath = pathParts.slice(0, -1).join('/');
        setCurrentPath(newPath || '/');
      } else {
        setCurrentPath(currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`);
      }
    } else {
      // Handle file selection/opening
      toast({
        title: "File selected",
        description: `Selected: ${file.name}`,
      });
    }
  };

  const handleFileAction = (action: string, fileName?: string) => {
    toast({
      title: `${action} action`,
      description: fileName ? `${action} ${fileName}` : `${action} operation started`,
    });
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="bg-gradient-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            File Manager
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button
              onClick={() => handleFileAction('Refresh')}
              variant="ghost"
              size="sm"
              className="min-w-[44px]"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleFileAction('Upload')}
              variant="ghost"
              size="sm"
              className="min-w-[44px]"
            >
              <Upload className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleFileAction('New Folder')}
              variant="ghost"
              size="sm"
              className="min-w-[44px]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/20 px-3 py-2 rounded">
          <Home className="w-4 h-4" />
          <span 
            className="cursor-pointer hover:text-foreground transition-colors"
            onClick={() => setCurrentPath('/')}
          >
            root
          </span>
          {pathParts.map((part, index) => (
            <div key={index} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3" />
              <span 
                className="cursor-pointer hover:text-foreground transition-colors"
                onClick={() => {
                  const newPath = '/' + pathParts.slice(0, index + 1).join('/');
                  setCurrentPath(newPath);
                }}
              >
                {part}
              </span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-4">
            {filteredFiles.map((file, index) => (
              <div
                key={index}
                onClick={() => handleFileClick(file)}
                className="flex items-center gap-3 p-2 hover:bg-muted/20 rounded cursor-pointer transition-colors group"
              >
                <div className="flex-shrink-0">
                  {file.type === 'directory' ? (
                    <Folder className="w-5 h-5 text-primary" />
                  ) : (
                    <File className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground truncate">
                      {file.name}
                    </span>
                    {file.name.endsWith('.cfg') && (
                      <Badge variant="secondary" className="text-xs">
                        CONFIG
                      </Badge>
                    )}
                    {file.name.endsWith('.xml') && (
                      <Badge variant="outline" className="text-xs">
                        XML
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span>{formatFileSize(file.size)}</span>
                    {file.modified && <span>{file.modified}</span>}
                    <span className="font-mono">{file.permissions}</span>
                  </div>
                </div>

                {file.name !== '..' && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.type === 'file' && (
                      <>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileAction('Edit', file.name);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileAction('Download', file.name);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileAction('Delete', file.name);
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Status Bar */}
        <div className="border-t border-border p-3 text-sm text-muted-foreground bg-muted/10">
          <div className="flex items-center justify-between">
            <span>
              {filteredFiles.length} items • Path: {currentPath}
            </span>
            <span>
              Total: {formatFileSize(filteredFiles.reduce((acc, file) => acc + file.size, 0))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}