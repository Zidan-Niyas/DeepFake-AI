# DeepFake-AI
## Running the Project Locally

### Step 1: Start the Backend Server

```shellscript
# Navigate to the backend directory
cd backend

# Activate the virtual environment if not already activated
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Run the Flask server
flask run --host=0.0.0.0 --port=5000
```

### Step 2: Start the Next.js Frontend

```shellscript
# In a new terminal, navigate to your project root
cd DeepFake-AI

# Run the development server
npm run dev
```

Your application should now be running at [http://localhost:3000](http://localhost:3000)
