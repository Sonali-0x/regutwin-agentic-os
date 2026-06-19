# ReguTwin Agentic OS - Comprehensive Test Suite

This document outlines the testing strategy and provides the exact test code for all three layers of the application: Backend, AI Layer, and Frontend. 

---

## How to Test Manually (Postman, Swagger, Browser)

### 1. Test Backend APIs in Postman
The Node.js backend runs on `http://localhost:8000`. You can import the following endpoints into Postman to test the backend directly:

*   **GET `/api/v1/health`**: Verify the backend is up.
*   **POST `/api/v1/regulations/upload`**: Upload a PDF or submit a URL.
    *   **Body Type**: `form-data`
    *   **Fields**: `file` (File), `source` (Text, e.g., "RBI"), `title` (Text).
*   **GET `/api/v1/maps`**: Retrieve all generated MAPs.
*   **PATCH `/api/v1/maps/:id/status`**: Update the status of a MAP.
    *   **Body (JSON)**: `{ "status": "IN_PROGRESS" }`
*   **POST `/api/v1/maps/:id/validate`**: Submit evidence for a MAP.
    *   **Body (JSON)**: `{ "evidenceText": "We have enabled TLS 1.3 on all internal load balancers." }`
*   **GET `/api/v1/audits`**: Retrieve the immutable governance audit trail.

> **Note**: If authentication is enabled, you'll need to pass an `Authorization: Bearer <token>` header obtained from the `/api/v1/auth/login` endpoint.

### 2. Test AI Layer APIs in Swagger (FastAPI)
The Python AI microservice runs on `http://localhost:8001` and automatically generates an interactive Swagger UI.

1.  Open your browser and navigate to **[http://localhost:8001/docs](http://localhost:8001/docs)**.
2.  You will see a list of available AI endpoints:
    *   **`POST /analyze`**: Test the Analyst Agent independently by providing raw regulatory text.
    *   **`POST /run-workflow`**: Trigger the entire LangGraph pipeline (Extraction -> Conflicts -> MAP generation).
    *   **`POST /detect-conflicts`**: Send a list of mock obligations to test the vector database retrieval.
    *   **`POST /generate-maps`**: Send an analysis object to see how the LLM routes tasks to departments.
    *   **`POST /validate-map`**: Test the Validator Agent with mock `action_required` and `evidence_text`.
3.  Click on any endpoint, click **"Try it out"**, fill in the JSON payload, and hit **Execute** to see the LLM response in real-time.

### 3. Test the Frontend Dashboard
The React dashboard runs on `http://localhost:5173`. To test the complete end-to-end integration:

1.  **Navigate to Upload**: Go to `http://localhost:5173/upload`. Upload a sample regulatory PDF (e.g., an RBI circular).
2.  **Watch the Live Updates**: After uploading, navigate to the **Regulations Explorer** (`/regulations`). You will see a live "Live Workflow Updates" toaster showing Socket.IO events as the LangGraph transitions through nodes (Extracting -> Detecting Conflicts -> Generating MAPs).
3.  **View Conflicts**: If the new regulation contradicts a previous one in ChromaDB, you will see a red `Regulatory Conflict Detected` warning banner.
4.  **Manage MAPs**: Navigate to the **MAPs Dashboard** (`/maps`). You will see actionable tasks auto-assigned to departments (e.g., IT Security, Risk). Try moving a task to `IN_PROGRESS`.
5.  **Audit Trail**: Navigate to the **Governance & Audit Trail** (`/audits`) to verify that the backend logged your status change and the initial MAP creation.

---

## 1. Backend Tests (Node.js + Express + Jest)

**Tech Stack:** `jest`, `supertest`, `mongodb-memory-server`
**Setup:** Install dependencies via `npm install -D jest supertest ts-jest @types/jest @types/supertest mongodb-memory-server`

### `tests/backend/regulation.test.ts`
```typescript
import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Regulation from "../../src/models/regulation.model";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Regulation API Endpoints", () => {
  it("should fetch all regulations", async () => {
    await Regulation.create({ title: "Test Reg", source: "RBI", status: "NEW" });
    const res = await request(app).get("/api/v1/regulations");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBe("Test Reg");
  });

  it("should fail to upload without a file", async () => {
    const res = await request(app).post("/api/v1/regulations/upload");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No file uploaded");
  });
});
```

### `tests/backend/map.test.ts`
```typescript
import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import MAP from "../../src/models/map.model";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("MAP API Endpoints", () => {
  let mapId: string;

  it("should fetch all MAPs", async () => {
    const res = await request(app).get("/api/v1/maps");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should update MAP status and log audit", async () => {
    const map = await MAP.create({
      regulationId: new mongoose.Types.ObjectId(),
      actionRequired: "Test Action",
      assignedTo: "IT Security",
      status: "OPEN"
    });
    
    const res = await request(app)
      .patch(`/api/v1/maps/${map._id}/status`)
      .send({ status: "IN_PROGRESS" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("IN_PROGRESS");
  });
});
```

---

## 2. AI Layer Tests (Python + FastAPI + Pytest)

**Tech Stack:** `pytest`, `httpx`
**Setup:** Install dependencies via `pip install pytest httpx`

### `tests/test_api.py`
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_analyze_endpoint():
    payload = {
        "text": "Banks must report cyber incidents within 6 hours.",
        "regulation_id": "mock_id",
        "title": "Cyber Reporting",
        "source": "RBI"
    }
    response = client.post("/analyze", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "obligations" in data
    assert len(data["obligations"]) > 0
    assert data["obligations"][0]["priority"] in ["HIGH", "MEDIUM", "LOW"]

def test_run_workflow_endpoint():
    payload = {
        "text": "All internal logs must be preserved for 90 days.",
        "regulation_id": "mock_workflow_id",
        "title": "Log Preservation",
        "source": "SEBI"
    }
    response = client.post("/run-workflow", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert "analysis" in data
    assert "maps" in data
    assert "conflicts" in data
```

### `tests/test_agents.py`
```python
import pytest
from agents.validator.validator_agent import validate_map, ValidationResult

def test_validator_agent_pass():
    action = "Install End-to-End Encryption"
    description = "All transit data must be encrypted."
    evidence = "We have implemented TLS 1.3 across all internal and external communication channels as shown in the attached firewall config."
    
    result = validate_map(action, description, evidence)
    assert isinstance(result, ValidationResult)
    assert result.is_valid is True
    assert result.confidence > 70

def test_validator_agent_fail():
    action = "Install End-to-End Encryption"
    description = "All transit data must be encrypted."
    evidence = "We talked about installing encryption next month."
    
    result = validate_map(action, description, evidence)
    assert result.is_valid is False
```

---

## 3. Frontend Tests (React + Vitest + React Testing Library)

**Tech Stack:** `vitest`, `@testing-library/react`, `@testing-library/jest-dom`
**Setup:** Add to Vite via `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`

### `tests/frontend/MapDashboard.test.tsx`
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MapDashboard from '../../src/pages/MAPs/MapDashboard';
import api from '../../src/services/api';

// Mock the API wrapper
vi.mock('../../src/services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('MapDashboard Component', () => {
  it('displays loading state initially', () => {
    vi.mocked(api.get).mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<MapDashboard />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it('renders MAPs fetched from the API', async () => {
    const mockMaps = [
      {
        _id: '1',
        actionRequired: 'Update Firewall',
        assignedTo: 'IT Security',
        status: 'OPEN',
        regulationId: { title: 'RBI Cyber Reg', source: 'RBI' },
      }
    ];

    vi.mocked(api.get).mockResolvedValueOnce({ data: mockMaps });
    
    render(<MapDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Update Firewall')).toBeInTheDocument();
      expect(screen.getByText('IT Security')).toBeInTheDocument();
      expect(screen.getByText('OPEN')).toBeInTheDocument();
    });
  });
});
```

### `tests/frontend/ConflictWarning.test.tsx`
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ConflictWarning from '../../src/components/ConflictWarning';

describe('ConflictWarning Component', () => {
  it('renders correctly when conflicts exist', () => {
    const conflicts = [
      {
        regulationId: '123',
        title: 'Old Password Policy',
        explanation: 'New policy requires 90 days, old requires 30 days.'
      }
    ];

    render(<ConflictWarning conflicts={conflicts} />);
    
    expect(screen.getByText(/Regulatory Conflict Detected/i)).toBeInTheDocument();
    expect(screen.getByText(/Old Password Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/New policy requires 90 days/i)).toBeInTheDocument();
  });

  it('returns null when no conflicts are passed', () => {
    const { container } = render(<ConflictWarning conflicts={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
```
