import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'spaces-api',
    timestamp: new Date().toISOString()
  });
});

// Sprint 1 routes
// app.use('/api/auth', authRoutes)
// app.use('/api/spaces', spacesRoutes)
// app.use('/api/occupancy', occupancyRoutes)
// app.use('/api/recommend', recommendRoutes)
// app.use('/api/admin', adminRoutes)

const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`Spaces API running on port ${PORT} in ${ENV} mode`);
});
