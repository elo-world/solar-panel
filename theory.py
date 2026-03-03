import numpy as np
import matplotlib.pyplot as plt

latitude = 47.75  # degrés (Nord +, Sud -)
day_of_year = 172  # jour à étudier (172 ≈ 21 juin)

# =========================================================
# FONCTIONS SOLAIRES
# =========================================================


def declination_rad(n):
    """
    Déclinaison solaire δ (radians)
    δ = 23.45° * sin(2π*(284+n)/365)
    """
    delta_deg = 23.45 * np.sin(2 * np.pi * (284 + n) / 365)
    return np.deg2rad(delta_deg)


def beta_opt_deg(latitude_deg, n, omega_deg):
    """
    Inclinaison optimale instantanée (plein sud)
    β = φ - atan( tan(δ) / cos(ω) )

    latitude_deg : latitude φ
    n : jour année
    omega_deg : angle horaire (°) (0 = midi solaire, ±15° = 1h)
    """
    phi = np.deg2rad(latitude_deg)
    delta = declination_rad(n)
    omega = np.deg2rad(omega_deg)

    beta = phi - np.arctan(np.tan(delta) / np.cos(omega))
    return np.rad2deg(beta)


# =========================================================
# Inclinaison optimale annuelle (midi solaire)
# =========================================================

days = np.arange(1, 366)
beta_noon = [beta_opt_deg(latitude, d, 0) for d in days]

plt.figure(figsize=(9, 4))
plt.plot(days, beta_noon)
plt.xlabel("Jour de l'année")
plt.ylabel("Inclinaison optimale (°)")
plt.title("Inclinaison optimale au midi solaire sur l'année")
plt.grid()
plt.show()


# =========================================================
# Variation horaire pour un jour donné
# =========================================================

omegas = np.linspace(-90, 90, 361)  # -6h à +6h
beta_hourly = beta_opt_deg(latitude, day_of_year, omegas)

plt.figure(figsize=(9, 4))
plt.plot(omegas / 15, beta_hourly)
plt.xlabel("Heure solaire (h)")
plt.ylabel("Inclinaison optimale (°)")
plt.title(f"Inclinaison horaire optimale - jour {day_of_year}")
plt.grid()
plt.show()


# =========================================================
# AFFICHAGE NUMÉRIQUE
# =========================================================

print(f"\nLatitude : {latitude}°")
print(f"Inclinaison optimale annuelle ≈ {latitude:.1f}° (règle simple)")

print("\nInclinaisons au midi solaire :")
for d, label in [(1, "Hiver"), (79, "Printemps"), (172, "Été"), (265, "Automne")]:
    beta = beta_opt_deg(latitude, d, 0)
    print(f"{label:10s} (jour {d:3d}) → {beta:.2f}°")
