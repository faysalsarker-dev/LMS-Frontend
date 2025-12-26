import { Editor } from '@tinymce/tinymce-react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

interface DocModuleProps {
  content: string;
  onChange: (content: string) => void;
}

export function DocModule({ content, onChange }: DocModuleProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="space-y-3 animate-fade-in">
      <Label>Document Content</Label>
      <p className="text-sm text-muted-foreground">
        Create rich text content with formatting, tables, and media.
      </p>
      
      {isLoading && (
        <Skeleton className="w-full h-[400px] rounded-lg" />
      )}
      
      <div className={isLoading ? 'hidden' : 'block'}>
        {/* <Editor
             apiKey='3r0h0evcqutrnicto2hw23g2gpsvdol4ehhd5ku45b87xg4f'
         
          value={content}
          onInit={() => setIsLoading(false)}
          onEditorChange={(newContent) => onChange(newContent)}
          init={{
            height: 400,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'table | removeformat | help',
            table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
            table_default_styles: {
              borderCollapse: 'collapse',
              width: '100%',
            },
            table_default_attributes: {
              border: '1',
            },
            content_style: `
              body { 
                font-family: Inter, system-ui, sans-serif; 
                font-size: 14px; 
                padding: 1rem;
                color: #1a1a2e;
              }
              table { 
                border-collapse: collapse; 
                width: 100%; 
              }
              table td, table th { 
                border: 1px solid #e2e8f0; 
                padding: 8px 12px; 
              }
              table th {
                background-color: #f8fafc;
                font-weight: 600;
              }
            `,
            skin: 'oxide',
            branding: false,
            promotion: false,
          }}
        /> */}

        <Editor
  apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
  value={content}
  onInit={() => setIsLoading(false)}
  onEditorChange={(newContent) => onChange(newContent)}
  init={{
    height: 400,
    menubar: true,
    plugins: [
      'advlist',
      'autolink',
      'lists',
      'link',
      'image',
      'charmap',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'insertdatetime',
      'media',
      'table',
      'help',
      'wordcount'
    ],
    toolbar:
      'undo redo | blocks | ' +
      'bold italic underline | forecolor backcolor | ' +
      'alignleft aligncenter alignright | ' +
      'bullist numlist outdent indent | ' +
      'table link image | code help',
    table_toolbar:
      'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | ' +
      'tableinsertcolbefore tableinsertcolafter tabledeletecol',
    content_style: `
      body {
        font-family: Inter, system-ui, sans-serif;
        font-size: 14px;
        padding: 1rem;
        color: #1a1a2e;
      }
      table {
        border-collapse: collapse;
        width: 100%;
      }
      table td, table th {
        border: 1px solid #e2e8f0;
        padding: 8px 12px;
      }
      table th {
        background-color: #f8fafc;
        font-weight: 600;
      }
    `,
    branding: false,
    promotion: false,
  }}
/>

      </div>
      
      <p className="text-xs text-muted-foreground">
        Note: For production use, replace with your own TinyMCE API key.
      </p>
    </div>
  );
}
