import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Line,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  FaChartBar, FaStar, FaCalendarAlt,
  FaBuilding, FaMapMarkerAlt, FaSpinner
} from 'react-icons/fa';
import { getOccupancyData, getBookingFrequency, getTopRatedListings } from '../api';
import './AdminAnalyticsPage.css';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState({
    occupancy: true,
    bookings: true,
    ratings: true
  });
  const [error, setError] = useState({
    occupancy: null,
    bookings: null,
    ratings: null
  });
  const [occupancyData, setOccupancyData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [topRatedListings, setTopRatedListings] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchOccupancyData();
    fetchBookingData();
    fetchTopRatedListings();
  }, [timeRange]);

  const fetchOccupancyData = async () => {
    setLoading(prev => ({ ...prev, occupancy: true }));
    setError(prev => ({ ...prev, occupancy: null }));
    
    try {
      const data = await getOccupancyData(timeRange);
      setOccupancyData(data);
    } catch (err) {
      console.error('Failed to fetch occupancy data:', err);
      setError(prev => ({ ...prev, occupancy: 'Failed to load occupancy data' }));
    } finally {
      setLoading(prev => ({ ...prev, occupancy: false }));
    }
  };

  const fetchBookingData = async () => {
    setLoading(prev => ({ ...prev, bookings: true }));
    setError(prev => ({ ...prev, bookings: null }));
    
    try {
      const data = await getBookingFrequency(timeRange);
      setBookingData(data);
    } catch (err) {
      console.error('Failed to fetch booking data:', err);
      setError(prev => ({ ...prev, bookings: 'Failed to load booking frequency data' }));
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

  const fetchTopRatedListings = async () => {
    setLoading(prev => ({ ...prev, ratings: true }));
    setError(prev => ({ ...prev, ratings: null }));
    
    try {
      const data = await getTopRatedListings();
      setTopRatedListings(data);
    } catch (err) {
      console.error('Failed to fetch top rated listings:', err);
      setError(prev => ({ ...prev, ratings: 'Failed to load top rated listings' }));
    } finally {
      setLoading(prev => ({ ...prev, ratings: false }));
    }
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  // Mock data for initial rendering if API fails
  const getMockOccupancyData = () => {
    return [
      { month: 'Jan', occupancyRate: 68, availableRooms: 120 },
      { month: 'Feb', occupancyRate: 72, availableRooms: 118 },
      { month: 'Mar', occupancyRate: 80, availableRooms: 125 },
      { month: 'Apr', occupancyRate: 85, availableRooms: 130 },
      { month: 'May', occupancyRate: 90, availableRooms: 135 },
      { month: 'Jun', occupancyRate: 95, availableRooms: 140 },
    ];
  };

  const getMockBookingData = () => {
    return [
      { day: 'Mon', bookings: 15 },
      { day: 'Tue', bookings: 12 },
      { day: 'Wed', bookings: 18 },
      { day: 'Thu', bookings: 20 },
      { day: 'Fri', bookings: 25 },
      { day: 'Sat', bookings: 30 },
      { day: 'Sun', bookings: 22 },
    ];
  };

  const getMockTopRatedListings = () => {
    return [
      { id: 1, title: 'Luxury Apartment in Downtown', rating: 4.9, reviewCount: 42, location: 'Downtown' },
      { id: 2, title: 'Cozy Studio near University', rating: 4.8, reviewCount: 38, location: 'University Area' },
      { id: 3, title: 'Modern Loft with City View', rating: 4.7, reviewCount: 56, location: 'West End' },
      { id: 4, title: 'Spacious 2 Bedroom with Garden', rating: 4.7, reviewCount: 31, location: 'Suburbs' },
      { id: 5, title: 'Charming Victorian House', rating: 4.6, reviewCount: 27, location: 'Historic District' },
    ];
  };

  const displayData = {
    occupancy: occupancyData.length > 0 ? occupancyData : getMockOccupancyData(),
    bookings: bookingData.length > 0 ? bookingData : getMockBookingData(),
    ratings: topRatedListings.length > 0 ? topRatedListings : getMockTopRatedListings(),
  };

  const generatePieData = () => {
    // Create pie chart data showing how many rooms are in each rating bracket
    const ratingBrackets = {
      '5 stars': 0,
      '4-4.9 stars': 0,
      '3-3.9 stars': 0,
      'Below 3 stars': 0,
      'No ratings': 0
    };

    displayData.ratings.forEach(room => {
      if (!room.rating) {
        ratingBrackets['No ratings']++;
      } else if (room.rating === 5) {
        ratingBrackets['5 stars']++;
      } else if (room.rating >= 4) {
        ratingBrackets['4-4.9 stars']++;
      } else if (room.rating >= 3) {
        ratingBrackets['3-3.9 stars']++;
      } else {
        ratingBrackets['Below 3 stars']++;
      }
    });

    return Object.entries(ratingBrackets).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="admin-analytics-page">
      <div className="analytics-header">
        <h1>Room Analytics</h1>
        
        <div className="analytics-filters">
          <FaCalendarAlt className="analytics-filter-icon" />
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="analytics-time-filter"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
        </div>
      </div>

      <div className="analytics-chart-row">
        <div className="analytics-chart-container">
          <div className="chart-header">
            <div className="chart-title">
              <FaBuilding />
              <h2>Room Occupancy Trends</h2>
            </div>
            {loading.occupancy && <FaSpinner className="chart-loading-spinner" />}
          </div>
          
          {error.occupancy ? (
            <div className="chart-error">{error.occupancy}</div>
          ) : (
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={displayData.occupancy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="occupancyRate" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name="Occupancy Rate (%)" 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="availableRooms" 
                    stroke="#82ca9d" 
                    name="Available Rooms" 
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="chart-insight">
                <p>Occupancy rates show how many available rooms are actually booked.</p>
              </div>
            </div>
          )}
        </div>

        <div className="analytics-chart-container">
          <div className="chart-header">
            <div className="chart-title">
              <FaChartBar />
              <h2>Booking Frequency</h2>
            </div>
            {loading.bookings && <FaSpinner className="chart-loading-spinner" />}
          </div>
          
          {error.bookings ? (
            <div className="chart-error">{error.bookings}</div>
          ) : (
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={displayData.bookings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" name="Number of Bookings" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="chart-insight">
                <p>Weekend bookings are typically higher than weekdays.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="analytics-chart-row">
        <div className="analytics-chart-container">
          <div className="chart-header">
            <div className="chart-title">
              <FaStar />
              <h2>Rating Distribution</h2>
            </div>
            {loading.ratings && <FaSpinner className="chart-loading-spinner" />}
          </div>
          
          {error.ratings ? (
            <div className="chart-error">{error.ratings}</div>
          ) : (
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={generatePieData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {generatePieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-insight">
                <p>Majority of listings have 4+ star ratings, indicating high quality.</p>
              </div>
            </div>
          )}
        </div>

        <div className="analytics-chart-container">
          <div className="chart-header">
            <div className="chart-title">
              <FaStar />
              <h2>Top Rated Listings</h2>
            </div>
            {loading.ratings && <FaSpinner className="chart-loading-spinner" />}
          </div>
          
          {error.ratings ? (
            <div className="chart-error">{error.ratings}</div>
          ) : (
            <div className="chart-body">
              <div className="top-rated-list">
                {displayData.ratings.slice(0, 5).map((room, index) => (
                  <div className="top-rated-item" key={room.id || index}>
                    <div className="top-rated-rank">{index + 1}</div>
                    <div className="top-rated-details">
                      <h3>{room.title}</h3>
                      <div className="top-rated-meta">
                        <span className="top-rated-location">
                          <FaMapMarkerAlt /> {room.location}
                        </span>
                        <span className="top-rated-rating">
                          <FaStar /> {formatRating(room.rating)} 
                          <span className="review-count">({room.reviewCount} reviews)</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chart-insight">
                <p>These listings have the highest ratings and most reviews.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
