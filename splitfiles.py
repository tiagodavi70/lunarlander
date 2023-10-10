import csv
import math

# Input CSV file name and desired number of output files (N)
input_csv_file = 'dataTest/RLLunarLanding2023.3.csv'
output_prefix = 'data/data'
N = 10

# Open the input CSV file for reading
with open(input_csv_file, 'r') as csvfile:
    reader = csv.reader(csvfile)
    header = next(reader)  # Read the header row

    # Calculate the number of rows per output file
    total_rows = sum(1 for _ in reader) + 1  # +1 for the header row
    rows_per_file = int(math.ceil(total_rows / N))

    # Rewind the CSV file back to the beginning
    csvfile.seek(0)

    for i in range(N):
        # Create the output CSV file
        output_csv_file = f'{output_prefix}_{i+1}.csv'
        with open(output_csv_file, 'w', newline='') as outfile:
            writer = csv.writer(outfile)
            
            # Write the header row to each output file
            if i != 0:
                writer.writerow(header)

            # Write the specified number of rows to the current output file
            for j in range(rows_per_file):
                row = next(reader, None)
                if row is not None:
                    writer.writerow(row)

print(f'CSV file "{input_csv_file}" has been broken into {N} smaller files.')
