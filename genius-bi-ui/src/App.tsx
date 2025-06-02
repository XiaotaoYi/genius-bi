import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Layout from './components/Layout';
import TermList from './pages/Term/TermList';
import TermCreate from './pages/Term/TermCreate';
import TermEdit from './pages/Term/TermEdit';
import ModelList from './pages/Model/ModelList';
import ModelCreate from './pages/Model/ModelCreate';
import ModelEdit from './pages/Model/ModelEdit';
import ModelDetail from './pages/Model/ModelDetail';
import DimensionList from './pages/Dimension/DimensionList';
import DimensionCreate from './pages/Dimension/DimensionCreate';
import DimensionEdit from './pages/Dimension/DimensionEdit';
import MetricList from './pages/Metric/MetricList';
import MetricCreate from './pages/Metric/MetricCreate';
import MetricEdit from './pages/Metric/MetricEdit';
import DatasetList from './pages/Dataset/DatasetList';
import DatasetCreate from './pages/Dataset/DatasetCreate';
import DatasetDetail from './pages/Dataset/DatasetDetail';
import LLMList from './pages/LLM/LLMList';
import LLMCreate from './pages/LLM/LLMCreate';
import LLMEdit from './pages/LLM/LLMEdit';
import DatabaseList from './pages/Database/DatabaseList';
import DatabaseCreate from './pages/Database/DatabaseCreate';
import DatabaseEdit from './pages/Database/DatabaseEdit';
import AnalysisAssistantList from './pages/AnalysisAssistant/AnalysisAssistantList';
import AnalysisAssistantCreate from './pages/AnalysisAssistant/AnalysisAssistantCreate';
import AnalysisAssistantEdit from './pages/AnalysisAssistant/AnalysisAssistantEdit';
import IndexMarketList from './pages/IndexMarket/IndexMarketList';
import UserList from './pages/User/UserList';
import PermissionList from './pages/Permission/PermissionList';
import SystemSettings from './pages/SystemSettings/SystemSettings';
import ChatList from './pages/Chat/ChatList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Layout />}>
        <Route path="chats" element={<ChatList />} />
          <Route path="terms" element={<TermList />} />
          <Route path="terms/create" element={<TermCreate />} />
          <Route path="terms/edit/:id" element={<TermEdit />} />
          <Route path="models" element={<ModelList />} />
          <Route path="models/create" element={<ModelCreate />} />
          <Route path="models/edit/:id" element={<ModelEdit />} />
          <Route path="models/:modelId" element={<ModelDetail />} />
          <Route path="dimensions" element={<DimensionList />} />
          <Route path="dimensions/create" element={<DimensionCreate />} />
          <Route path="dimensions/edit/:id" element={<DimensionEdit />} />
          <Route path="metrics" element={<MetricList />} />
          <Route path="metrics/create" element={<MetricCreate />} />
          <Route path="metrics/edit/:id" element={<MetricEdit />} />
          <Route path="datasets" element={<DatasetList />} />
          <Route path="datasets/create" element={<DatasetCreate />} />
          <Route path="datasets/detail/:id" element={<DatasetDetail />} />
          <Route path="llms" element={<LLMList />} />
          <Route path="llms/create" element={<LLMCreate />} />
          <Route path="llms/edit/:id" element={<LLMEdit />} />
          <Route path="databases" element={<DatabaseList />} />
          <Route path="databases/create" element={<DatabaseCreate />} />
          <Route path="databases/edit/:id" element={<DatabaseEdit />} />
          <Route path="analysis-assistants" element={<AnalysisAssistantList />} />
          <Route path="analysis-assistants/create" element={<AnalysisAssistantCreate />} />
          <Route path="analysis-assistants/edit/:id" element={<AnalysisAssistantEdit />} />
          <Route path="index-markets" element={<IndexMarketList />} />
          <Route path="users" element={<UserList />} />
          <Route path="permissions" element={<PermissionList />} />
          <Route path="system-settings" element={<SystemSettings />} />

          {/* Add a default route for the layout, e.g., redirect to terminology list */}
          <Route path="" element={<TermList />} />

        </Route>
        {/* Add a redirect to login for the root path */}
        <Route path="/" element={<Layout />} />
      </Routes>
    </Router>
  );
}

export default App; 