import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Box, Button } from '@mui/material'
import AllNotifications from '../pages/AllNotifications'
import PriorityNotifications from '../pages/PriorityNotifications'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Box className="app">
        <AppBar position="sticky" className="app-bar">
          <Toolbar>
            <div className="logo">📬 Campus Notifications</div>
            <Box className="nav-links">
              <Link to="/">
                <Button color="inherit" className="nav-button">All Notifications</Button>
              </Link>
              <Link to="/priority">
                <Button color="inherit" className="nav-button">⭐ Priority</Button>
              </Link>
            </Box>
          </Toolbar>
        </AppBar>

        <Box className="content">
          <Routes>
            <Route path="/" element={<AllNotifications />} />
            <Route path="/priority" element={<PriorityNotifications />} />
          </Routes>
        </Box>

        <footer className="app-footer">
          <p>Campus Notification System - Stage 2 | Priority Inbox Enabled</p>
        </footer>
      </Box>
    </BrowserRouter>
  )
}

export default App
