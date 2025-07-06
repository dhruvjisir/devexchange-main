-- Insert basic plans
INSERT INTO plans (id, name, description, price, duration_days, features) VALUES
('basic', 'Basic Plan', 'Essential features for individuals', 999, 30, '{
  "max_projects": 3,
  "max_storage": "5GB",
  "support": "Email",
  "features": [
    "Basic analytics",
    "Project management",
    "Team collaboration"
  ]
}'),
('pro', 'Pro Plan', 'Advanced features for professionals', 1999, 30, '{
  "max_projects": 10,
  "max_storage": "20GB",
  "support": "Priority Email",
  "features": [
    "Advanced analytics",
    "Project management",
    "Team collaboration",
    "API access",
    "Custom integrations"
  ]
}'),
('enterprise', 'Enterprise Plan', 'Complete solution for businesses', 4999, 30, '{
  "max_projects": "Unlimited",
  "max_storage": "100GB",
  "support": "24/7 Priority Support",
  "features": [
    "Advanced analytics",
    "Project management",
    "Team collaboration",
    "API access",
    "Custom integrations",
    "Dedicated account manager",
    "Custom development"
  ]
}')
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  duration_days = EXCLUDED.duration_days,
  features = EXCLUDED.features,
  updated_at = NOW(); 