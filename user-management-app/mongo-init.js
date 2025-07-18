// MongoDB initialization script
db = db.getSiblingDB('usermanagement');

// Create users collection with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'must be a valid email and is required'
        },
        password: {
          bsonType: 'string',
          minLength: 6,
          description: 'must be a string with minimum 6 characters and is required'
        },
        role: {
          bsonType: 'string',
          enum: ['User', 'Admin', 'Manager'],
          description: 'must be one of the enum values'
        },
        status: {
          bsonType: 'string',
          enum: ['Active', 'Inactive'],
          description: 'must be one of the enum values'
        }
      }
    }
  }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ status: 1 });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: -1 });

print('Database initialized successfully');
