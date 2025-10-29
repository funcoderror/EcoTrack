import sql from '../database/db.js';

// Calculate carbon footprint
export const calculateCarbonFootprint = async (req, res) => {
  try {
    const userId = req.user.id;
    const { transport, electricity, diet, flights, waste } = req.body;

    // Validate input
    if (transport < 0 || electricity < 0 || flights < 0 || waste < 0) {
      return res.status(400).json({ error: 'Values cannot be negative' });
    }

    // Emission factors (approximate values)
    const transportCO2 = (transport * 0.2 * 365) / 1000; // kg CO2 per km * days per year / 1000 to get tons
    const electricityCO2 = electricity * 12 * 0.0007; // kWh * months * emission factor
    const dietCO2 = parseFloat(diet); // Already in tons CO2/year
    const flightsCO2 = flights * 0.25; // tons CO2 per flight (average)
    const wasteCO2 = waste * 52 * 0.001; // kg per week * weeks per year * emission factor

    const totalCO2 = transportCO2 + electricityCO2 + dietCO2 + flightsCO2 + wasteCO2;

    // Save calculation to database
    const result = await sql`
      INSERT INTO carbon_footprint_calculations (
        user_id, transport_km_daily, electricity_kwh_monthly, diet_type, 
        flights_yearly, waste_kg_weekly, transport_co2, electricity_co2, 
        diet_co2, flights_co2, waste_co2, total_co2_tons
      ) VALUES (
        ${userId}, ${transport}, ${electricity}, ${diet}, 
        ${flights}, ${waste}, ${transportCO2}, ${electricityCO2}, 
        ${dietCO2}, ${flightsCO2}, ${wasteCO2}, ${totalCO2}
      ) RETURNING *
    `;

    res.status(201).json({
      success: true,
      data: {
        id: result[0].id,
        totalCO2: parseFloat(totalCO2.toFixed(3)),
        breakdown: {
          transport: parseFloat(transportCO2.toFixed(3)),
          electricity: parseFloat(electricityCO2.toFixed(3)),
          diet: parseFloat(dietCO2.toFixed(3)),
          flights: parseFloat(flightsCO2.toFixed(3)),
          waste: parseFloat(wasteCO2.toFixed(3))
        },
        inputs: {
          transport,
          electricity,
          diet: parseFloat(diet),
          flights,
          waste
        },
        calculationDate: result[0].calculation_date
      }
    });
  } catch (error) {
    console.error('Error calculating carbon footprint:', error);
    res.status(500).json({ error: 'Failed to calculate carbon footprint' });
  }
};

// Get user's carbon footprint history
export const getCarbonFootprintHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    const calculations = await sql`
      SELECT * FROM carbon_footprint_calculations 
      WHERE user_id = ${userId} 
      ORDER BY calculation_date DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;

    const total = await sql`
      SELECT COUNT(*) as count FROM carbon_footprint_calculations 
      WHERE user_id = ${userId}
    `;

    res.json({
      success: true,
      data: calculations.map(calc => ({
        id: calc.id,
        totalCO2: parseFloat(calc.total_co2_tons),
        breakdown: {
          transport: parseFloat(calc.transport_co2),
          electricity: parseFloat(calc.electricity_co2),
          diet: parseFloat(calc.diet_co2),
          flights: parseFloat(calc.flights_co2),
          waste: parseFloat(calc.waste_co2)
        },
        inputs: {
          transport: parseFloat(calc.transport_km_daily),
          electricity: parseFloat(calc.electricity_kwh_monthly),
          diet: parseFloat(calc.diet_type),
          flights: calc.flights_yearly,
          waste: parseFloat(calc.waste_kg_weekly)
        },
        calculationDate: calc.calculation_date
      })),
      pagination: {
        total: parseInt(total[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching carbon footprint history:', error);
    res.status(500).json({ error: 'Failed to fetch carbon footprint history' });
  }
};

// Get latest carbon footprint calculation
export const getLatestCarbonFootprint = async (req, res) => {
  try {
    const userId = req.user.id;

    const latest = await sql`
      SELECT * FROM carbon_footprint_calculations 
      WHERE user_id = ${userId} 
      ORDER BY calculation_date DESC 
      LIMIT 1
    `;

    if (latest.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No carbon footprint calculations found'
      });
    }

    const calc = latest[0];
    res.json({
      success: true,
      data: {
        id: calc.id,
        totalCO2: parseFloat(calc.total_co2_tons),
        breakdown: {
          transport: parseFloat(calc.transport_co2),
          electricity: parseFloat(calc.electricity_co2),
          diet: parseFloat(calc.diet_co2),
          flights: parseFloat(calc.flights_co2),
          waste: parseFloat(calc.waste_co2)
        },
        inputs: {
          transport: parseFloat(calc.transport_km_daily),
          electricity: parseFloat(calc.electricity_kwh_monthly),
          diet: parseFloat(calc.diet_type),
          flights: calc.flights_yearly,
          waste: parseFloat(calc.waste_kg_weekly)
        },
        calculationDate: calc.calculation_date
      }
    });
  } catch (error) {
    console.error('Error fetching latest carbon footprint:', error);
    res.status(500).json({ error: 'Failed to fetch latest carbon footprint' });
  }
};

// Delete a carbon footprint calculation
export const deleteCarbonFootprint = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await sql`
      DELETE FROM carbon_footprint_calculations 
      WHERE id = ${id} AND user_id = ${userId} 
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Carbon footprint calculation not found' });
    }

    res.json({
      success: true,
      message: 'Carbon footprint calculation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting carbon footprint:', error);
    res.status(500).json({ error: 'Failed to delete carbon footprint calculation' });
  }
};