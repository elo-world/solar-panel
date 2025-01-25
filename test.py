import math

# Constants
n = 25  # Day of the year (January 25)
max_declination = 23.45  # Earth's axial tilt in degrees

# Solar declination formula
declination = max_declination

print(declination, (((360 / 365) * (n - 81)) * math.pi) / 180)