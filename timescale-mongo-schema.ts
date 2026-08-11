/**
 * OmniTwin NoSQL (MongoDB) & TimescaleDB Time-Series Telemetry Schemas
 * Optimized for high-frequency IoT sensor telemetry ingestion and drone stream analytics.
 */

export const TIMESCALEDB_TELEMETRY_SCHEMA_SQL = `
-- ====================================================================
-- TimescaleDB Hypertable Setup for Sensor Telemetry Stream
-- High-throughput time-series database architecture
-- ====================================================================

-- Create raw telemetry time-series hypertable
CREATE TABLE IF NOT EXISTS sensor_telemetry (
    time TIMESTAMPTZ NOT NULL,
    sensor_id VARCHAR(64) NOT NULL,
    sensor_type VARCHAR(50) NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL,
    battery_level INTEGER,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);

-- Convert standard PostgreSQL table to TimescaleDB Hypertable partitioned by 1-day chunks
SELECT create_hypertable('sensor_telemetry', 'time', chunk_time_interval => INTERVAL '1 day', if_not_exists => TRUE);

-- Create composite index for instant historical time-series rollups
CREATE INDEX IF NOT EXISTS idx_telemetry_sensor_time ON sensor_telemetry (sensor_id, time DESC);

-- Automatic Continuous Aggregate View for 15-minute Water Level Rollups
CREATE MATERIALIZED VIEW IF NOT EXISTS water_level_15min_avg
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('15 minutes', time) AS bucket,
    sensor_id,
    AVG(value) AS avg_level,
    MAX(value) AS peak_level,
    MIN(value) AS min_level
FROM sensor_telemetry
WHERE sensor_type = 'water_level'
GROUP BY bucket, sensor_id;

-- Retention Policy: Keep raw telemetry for 90 days, compressed after 7 days
SELECT add_retention_policy('sensor_telemetry', INTERVAL '90 days', if_not_exists => TRUE);
`;

export const MONGO_SERIES_COLLECTION_SCHEMA = {
  dbName: "omnitwin_telemetry",
  collections: [
    {
      name: "iot_telemetry",
      options: {
        timeseries: {
          timeField: "timestamp",
          metaField: "metadata",
          granularity: "seconds"
        },
        expireAfterSeconds: 7776000 // 90 days TTL
      },
      schemaValidation: {
        $jsonSchema: {
          bsonType: "object",
          required: ["timestamp", "metadata", "value"],
          properties: {
            timestamp: { bsonType: "date" },
            value: { bsonType: "double" },
            metadata: {
              bsonType: "object",
              required: ["sensor_id", "sensor_type"],
              properties: {
                sensor_id: { bsonType: "string" },
                sensor_type: { bsonType: "string" },
                unit: { bsonType: "string" },
                location: {
                  bsonType: "object",
                  properties: {
                    lat: { bsonType: "double" },
                    lng: { bsonType: "double" }
                  }
                }
              }
            }
          }
        }
      }
    },
    {
      name: "drone_vision_logs",
      options: {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["drone_id", "timestamp", "ai_detections"],
            properties: {
              drone_id: { bsonType: "string" },
              timestamp: { bsonType: "date" },
              frame_index: { bsonType: "int" },
              telemetry: {
                bsonType: "object",
                properties: {
                  lat: { bsonType: "double" },
                  lng: { bsonType: "double" },
                  alt_m: { bsonType: "double" },
                  speed_ms: { bsonType: "double" }
                }
              },
              ai_detections: {
                bsonType: "array",
                items: {
                  bsonType: "object",
                  required: ["label", "confidence", "bounding_box"],
                  properties: {
                    label: { bsonType: "string" },
                    confidence: { bsonType: "double" },
                    severity: { bsonType: "string" },
                    bounding_box: {
                      bsonType: "array",
                      minItems: 4,
                      maxItems: 4
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  ]
};
