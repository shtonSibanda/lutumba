const mysql = require('mysql2/promise');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function diagnoseMySQLIssues() {
  console.log('🔍 Diagnosing MySQL Connection Issues...\n');

  // Check 1: MySQL Service Status
  console.log('1. Checking MySQL Service Status...');
  try {
    const { stdout } = await execPromise('sc query mysql');
    if (stdout.includes('RUNNING')) {
      console.log('✅ MySQL service is running');
    } else {
      console.log('❌ MySQL service is not running');
      console.log('   Fix: Run "net start mysql" as administrator');
    }
  } catch (error) {
    console.log('❌ MySQL service not found');
    console.log('   Fix: Install MySQL from https://dev.mysql.com/downloads/mysql/');
  }

  // Check 2: Port 3306 availability
  console.log('\n2. Checking Port 3306...');
  try {
    const { stdout } = await execPromise('netstat -an | findstr :3306');
    if (stdout.includes('3306')) {
      console.log('✅ Port 3306 is in use (MySQL likely running)');
    } else {
      console.log('❌ Port 3306 is not in use');
      console.log('   Fix: Start MySQL service');
    }
  } catch (error) {
    console.log('⚠️  Could not check port status');
  }

  // Check 3: MySQL Connection Test
  console.log('\n3. Testing MySQL Connection...');
  const configs = [
    { host: 'localhost', user: 'root', password: '', port: 3306 },
    { host: '127.0.0.1', user: 'root', password: '', port: 3306 },
    { host: 'localhost', user: 'root', password: 'root', port: 3306 },
    { host: 'localhost', user: 'root', password: 'password', port: 3306 }
  ];

  for (const config of configs) {
    try {
      console.log(`   Testing: ${config.user}@${config.host}:${config.port} (password: ${config.password ? 'yes' : 'no'})`);
      const connection = await mysql.createConnection(config);
      console.log('✅ Connection successful!');
      
      // Test database creation
      await connection.execute('CREATE DATABASE IF NOT EXISTS school_management');
      console.log('✅ Database "school_management" created/verified');
      
      await connection.end();
      
      // Save working config
      console.log('\n🎯 Working configuration found:');
      console.log(`DB_HOST=${config.host}`);
      console.log(`DB_USER=${config.user}`);
      console.log(`DB_PASSWORD=${config.password}`);
      console.log(`DB_PORT=${config.port}`);
      console.log(`DB_NAME=school_management`);
      
      return config;
    } catch (error) {
      console.log(`❌ Failed: ${error.message.split('\n')[0]}`);
    }
  }

  console.log('\n❌ All connection attempts failed');
  console.log('\n📋 Common Solutions:');
  console.log('1. Install MySQL: https://dev.mysql.com/downloads/mysql/');
  console.log('2. Start MySQL service: net start mysql');
  console.log('3. Reset root password: mysql -u root -p');
  console.log('4. Check MySQL is running on port 3306');
  
  return null;
}

// Run diagnostics
diagnoseMySQLIssues().then((workingConfig) => {
  if (workingConfig) {
    console.log('\n✅ MySQL is working! You can now run the desktop app.');
  } else {
    console.log('\n❌ Please fix MySQL issues before running the desktop app.');
  }
}).catch(console.error);
