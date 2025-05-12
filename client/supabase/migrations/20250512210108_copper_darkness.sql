/*
  # Create loans table

  1. New Table
    - `loans`
      - `id` (uuid, primary key)
      - `age` (integer)
      - `income` (numeric)
      - `loan_amount` (numeric)
      - `credit_score` (integer)
      - `debt_to_income_ratio` (float)
      - `employment_years` (integer)
      - `savings_balance` (numeric)
      - `existing_loans` (integer)
      - `risk_score` (numeric)
      - `approval_status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `loans` table
    - Add policy for authenticated users to read all loans
    - Add policy for authenticated users to insert their own loans
*/

CREATE TABLE IF NOT EXISTS loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  age integer NOT NULL,
  income numeric NOT NULL,
  loan_amount numeric NOT NULL,
  credit_score integer NOT NULL,
  debt_to_income_ratio float NOT NULL,
  employment_years integer NOT NULL,
  savings_balance numeric NOT NULL,
  existing_loans integer NOT NULL,
  risk_score numeric,
  approval_status text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all loans"
  ON loans
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert loans"
  ON loans
  FOR INSERT
  TO authenticated
  WITH CHECK (true);