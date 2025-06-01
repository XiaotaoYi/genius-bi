import os
import re

def fix_imports_in_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Get the model name from the file path
    model_name = os.path.basename(file_path).replace('.py', '').replace('_', ' ').title().replace(' ', '')
    
    # Replace relative imports with absolute imports
    content = re.sub(r'from \.\. import models, schemas', 
                    f'from models import {model_name} as {model_name}Model\n'
                    f'from schemas import {model_name} as {model_name}Schema\n'
                    f'from schemas import {model_name}Create, {model_name}Update', 
                    content)
    content = re.sub(r'from \.\.database import get_db', 'from database import get_db', content)
    
    # Replace model references
    content = re.sub(r'models\.(\w+)', r'\1Model', content)
    content = re.sub(r'schemas\.(\w+)', r'\1', content)  # Remove Schema suffix since it's already in the import
    
    # Replace response_model references
    content = re.sub(r'response_model=(\w+)(?!Schema)', r'response_model=\1Schema', content)
    content = re.sub(r'response_model=List\[(\w+)(?!Schema)\]', r'response_model=List[\1Schema]', content)

    with open(file_path, 'w') as f:
        f.write(content)

def main():
    routers_dir = 'src/routers'
    for filename in os.listdir(routers_dir):
        if filename.endswith('.py') and not filename.startswith('__'):
            file_path = os.path.join(routers_dir, filename)
            print(f'Fixing imports in {filename}...')
            fix_imports_in_file(file_path)

if __name__ == '__main__':
    main() 