import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const testMySQL = async () => {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
  };

  try {
    console.log('🔍 Testing MySQL connection...');
    console.log('Host:', config.host);
    console.log('User:', config.user);
    console.log('Port:', config.port);
    
    const connection = await mysql.createConnection(config);
    console.log('✅ MySQL connection successful!');
    
    // Test if database exists
    const [rows] = await connection.execute('SHOW DATABASES LIKE "school_management"');
    if (rows.length > 0) {
      console.log('✅ Database "school_management" exists');
    } else {
      console.log('⚠️  Database "school_management" does not exist');
      console.log('   Run: setup-database.bat to create it');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.log('\n📋 Troubleshooting:');
    console.log('1. Make sure MySQL is installed and running');
    console.log('2. Check your password in config.env');
    console.log('3. Try: mysql -u root -p to test manually');
  }
};

testMySQL(); 