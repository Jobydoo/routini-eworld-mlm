# -*- coding: utf-8 -*-
"""
Script de génération du Manuel d'Utilisation et Plan de Test PDF
Routini eWorld MLM - Version 4 (Septembre 2026)
"""

import os
import sys
import base64
import subprocess
import time

def get_base64_image(image_path):
    if os.path.exists(image_path):
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode('utf-8')
    return ""

def main():
    workspace = r"c:\Users\hp\.gemini\antigravity-ide\scratch\dxn-eworld-mlm"
    desktop = r"C:\Users\hp\Desktop"
    output_pdf = os.path.join(desktop, "MANUEL_UTILISATION_ET_PLAN_DE_TEST_ROUTINI_MLM.pdf")
    temp_html = os.path.join(workspace, "document_complet_recette.html")

    brand_logo_path = os.path.join(workspace, "assets", "images", "routini-brand-transparent.png")
    icon_logo_path = os.path.join(workspace, "assets", "images", "routini-icon-transparent.png")

    brand_b64 = get_base64_image(brand_logo_path)
    icon_b64 = get_base64_image(icon_logo_path)

    html_content = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Routini eWorld MLM — Manuel d'Utilisation & Plan de Test</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=JetBrains+Mono:wght@400;600;700&display=swap');

    @page {{
      size: A4 portrait;
      margin: 18mm 14mm 18mm 14mm;
      @bottom-right {{
        content: "Page " counter(page);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
      }}
      @bottom-left {{
        content: "Routini eWorld MLM V4 — Document Confidentiel Direction";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8pt;
        color: #94a3b8;
      }}
    }}

    @page:first {{
      margin: 0;
      @bottom-right {{ content: none; }}
      @bottom-left {{ content: none; }}
    }}

    *, *::before, *::after {{
      box-sizing: border-box;
    }}

    body {{
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 9.5pt;
      line-height: 1.55;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}

    /* COVER PAGE */
    .cover-page {{
      page-break-after: always;
      height: 100vh;
      min-height: 297mm;
      background: linear-gradient(145deg, #2a0820 0%, #4a044e 35%, #831843 75%, #be185d 100%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 50mm 24mm 35mm 24mm;
      position: relative;
      overflow: hidden;
    }}

    .cover-page::before {{
      content: "";
      position: absolute;
      top: -120px;
      right: -120px;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(251, 191, 36, 0.18) 0%, rgba(251, 191, 36, 0) 70%);
      border-radius: 50%;
    }}

    .cover-page::after {{
      content: "";
      position: absolute;
      bottom: -100px;
      left: -100px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(244, 114, 182, 0.22) 0%, rgba(244, 114, 182, 0) 70%);
      border-radius: 50%;
    }}

    .cover-header {{
      position: relative;
      z-index: 2;
    }}

    .cover-brand-logo {{
      max-width: 260px;
      height: auto;
      margin-bottom: 24px;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.35));
    }}

    .cover-badge {{
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(251, 191, 36, 0.6);
      color: #fef08a;
      font-size: 8.5pt;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 30px;
      margin-bottom: 25px;
      backdrop-filter: blur(8px);
    }}

    .cover-title {{
      font-family: 'Playfair Display', serif;
      font-size: 28pt;
      font-weight: 800;
      line-height: 1.2;
      margin: 0 0 16px 0;
      color: #ffffff;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }}

    .cover-title span {{
      color: #fef08a;
      font-style: italic;
    }}

    .cover-subtitle {{
      font-size: 13pt;
      font-weight: 400;
      line-height: 1.5;
      color: #fce7f3;
      max-width: 620px;
      margin: 0 0 30px 0;
    }}

    .cover-features-list {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 20px;
      position: relative;
      z-index: 2;
    }}

    .cover-feat-card {{
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      padding: 12px 16px;
      backdrop-filter: blur(5px);
    }}

    .cover-feat-card strong {{
      display: block;
      color: #fef08a;
      font-size: 9pt;
      font-weight: 700;
      margin-bottom: 3px;
    }}

    .cover-feat-card span {{
      color: #fdf2f8;
      font-size: 8pt;
    }}

    .cover-footer {{
      position: relative;
      z-index: 2;
      border-top: 1px solid rgba(255, 255, 255, 0.25);
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }}

    .cover-meta-item {{
      font-size: 8pt;
      color: #fbcfe8;
      line-height: 1.6;
    }}

    .cover-meta-item strong {{
      color: #ffffff;
    }}

    /* INNER STYLES */
    .page {{
      page-break-after: always;
      position: relative;
    }}

    .page:last-child {{
      page-break-after: auto;
    }}

    .header-rule {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 8px;
      margin-bottom: 20px;
    }}

    .header-rule .doc-title {{
      font-size: 8pt;
      font-weight: 700;
      color: #9d174d;
      text-transform: uppercase;
      letter-spacing: 1px;
    }}

    .header-rule .version-tag {{
      font-size: 7.5pt;
      background: #fdf2f8;
      color: #be185d;
      border: 1px solid #fbcfe8;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 700;
    }}

    h1, h2, h3, h4 {{
      color: #0f172a;
      margin-top: 0;
    }}

    h1 {{
      font-family: 'Playfair Display', serif;
      font-size: 18pt;
      font-weight: 800;
      color: #831843;
      margin-bottom: 12px;
      border-bottom: 2px solid #fce7f3;
      padding-bottom: 6px;
    }}

    h2 {{
      font-size: 12.5pt;
      font-weight: 800;
      color: #1e293b;
      margin: 18px 0 10px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }}

    h2 .section-num {{
      background: #be185d;
      color: #ffffff;
      font-size: 8.5pt;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }}

    h3 {{
      font-size: 10.5pt;
      font-weight: 700;
      color: #334155;
      margin: 14px 0 6px 0;
    }}

    p {{
      margin: 0 0 10px 0;
      color: #334155;
    }}

    /* CALLOUT BOXES */
    .callout {{
      border-radius: 8px;
      padding: 12px 16px;
      margin: 12px 0;
      font-size: 8.8pt;
    }}

    .callout-gold {{
      background: #fefce8;
      border: 1px solid #fde047;
      border-left: 5px solid #d97706;
      color: #78350f;
    }}

    .callout-rose {{
      background: #fdf2f8;
      border: 1px solid #fbcfe8;
      border-left: 5px solid #be185d;
      color: #831843;
    }}

    .callout-green {{
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 5px solid #16a34a;
      color: #14532d;
    }}

    .callout-dark {{
      background: #0f172a;
      border: 1px solid #334155;
      color: #e2e8f0;
    }}

    /* TABLES */
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 8.5pt;
    }}

    th, td {{
      padding: 8px 10px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }}

    th {{
      background: #f8fafc;
      color: #334155;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 7.5pt;
      letter-spacing: 0.5px;
      border-top: 1px solid #cbd5e1;
      border-bottom: 2px solid #cbd5e1;
    }}

    tr:nth-child(even) td {{
      background: #fafafa;
    }}

    .table-compact th, .table-compact td {{
      padding: 6px 8px;
      font-size: 8pt;
    }}

    /* BADGES */
    .badge {{
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
    }}

    .badge-rose {{ background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; }}
    .badge-gold {{ background: #fefce8; color: #b45309; border: 1px solid #fde68a; }}
    .badge-green {{ background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }}
    .badge-blue {{ background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }}
    .badge-dark {{ background: #1e293b; color: #ffffff; }}

    /* CODE & KEYS */
    .code-box {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      border-radius: 6px;
      color: #0f172a;
    }}

    /* GRID FOR FEATURES */
    .grid-2 {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 12px 0;
    }}

    .grid-3 {{
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
      margin: 12px 0;
    }}

    .card {{
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }}

    .card-head {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 6px;
    }}

    .card-head strong {{
      font-size: 9pt;
      color: #0f172a;
    }}

    /* SCENARIO CARD */
    .scenario-card {{
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      margin-bottom: 16px;
      padding: 14px 16px;
      page-break-inside: avoid;
    }}

    .scenario-header {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      border-bottom: 1.5px solid #fce7f3;
      padding-bottom: 8px;
    }}

    .scenario-title {{
      font-size: 11pt;
      font-weight: 800;
      color: #831843;
      margin: 0;
    }}

    .scenario-meta {{
      font-size: 8pt;
      color: #64748b;
      margin-top: 2px;
    }}

    .step-list {{
      margin: 8px 0;
      padding-left: 20px;
      font-size: 8.8pt;
    }}

    .step-list li {{
      margin-bottom: 5px;
      color: #334155;
    }}

    .expected-box {{
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 8px 12px;
      margin-top: 8px;
      font-size: 8.5pt;
      color: #14532d;
    }}

    .expected-box strong {{
      color: #166534;
      display: block;
      margin-bottom: 2px;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    .signature-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 30px;
    }}

    .signature-box {{
      border: 1.5px dashed #cbd5e1;
      border-radius: 8px;
      padding: 16px;
      min-height: 120px;
      background: #f8fafc;
    }}
  </style>
</head>
<body>

  <!-- ========================================================================
       PAGE DE GARDE
       ======================================================================== -->
  <div class="cover-page">
    <div class="cover-header">
      <img src="data:image/png;base64,{brand_b64}" alt="Routini Cosmetics" class="cover-brand-logo">
      <div class="cover-badge">Modèle Officiel • ROUTINI ONE PLAN V4</div>
      <h1 class="cover-title">MANUEL D'UTILISATION &amp;<br>PLAN DE TEST DE <span>RECETTE</span></h1>
      <p class="cover-subtitle">
        Guide de référence complet destiné au Propriétaire &amp; à la Direction Générale pour la prise en main, la vérification financière et la validation de l'écosystème digital Routini eWorld MLM.
      </p>

      <div class="cover-features-list">
        <div class="cover-feat-card">
          <strong>1. Modèle Mathématique V4</strong>
          <span>PM = 90% PP • PV = PP/10 • CV = 60% PM • Sorties variables &le; 15%</span>
        </div>
        <div class="cover-feat-card">
          <strong>2. Structure des 6 Rangs</strong>
          <span>Partner &bull; Builder (2 000 PV) &bull; Leader &bull; Manager &bull; Diamond &bull; Ambassador</span>
        </div>
        <div class="cover-feat-card">
          <strong>3. Console Super Admin &amp; Vercel</strong>
          <span>Contrôle du catalogue, stress test direct et base cloud Neon Postgres</span>
        </div>
        <div class="cover-feat-card">
          <strong>4. 9 Scénarios de Test Opérationnels</strong>
          <span>Validation pas-à-pas de bout en bout avec résultats chiffrés certifiés</span>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div class="cover-meta-item">
        <strong>Entité :</strong> Routini Cosmetics (By Lys Horizon Maroc)<br>
        <strong>Portail Applicatif :</strong> Routini eWorld MLM — Version 4 (Septembre 2026)<br>
        <strong>Destinataire :</strong> Propriétaire &amp; Fondateur
      </div>
      <div class="cover-meta-item" style="text-align: right;">
        <strong>Document certifié :</strong> Conforme aux 18 Slides Officielles<br>
        <strong>Date d'édition :</strong> Octobre 2026<br>
        <strong>Statut :</strong> Recette &amp; Validation Finale
      </div>
    </div>
  </div>

  <!-- ========================================================================
       PAGE 1 : SOMMAIRE & CADRE STRATÉGIQUE V4
       ======================================================================== -->
  <div class="page">
    <div class="header-rule">
      <span class="doc-title">Routini eWorld MLM — Manuel d'Utilisation &amp; Recette V4</span>
      <span class="version-tag">Version 4 • Septembre 2026</span>
    </div>

    <h1>1. Introduction Stratégique &amp; Formules Clés V4</h1>

    <p>
      Le présent document réunit le <strong>Manuel d'Utilisation Officiel</strong> et le <strong>Plan de Test et de Validation</strong> de la plateforme <strong>Routini eWorld MLM</strong>. Développée conformément aux 18 slides officielles du modèle <em>ROUTINI ONE PLAN (Version 4 • Septembre 2026)</em>, cette plateforme allie l'excellence du e-commerce cosmétique marocain haut de gamme à un moteur de distribution en réseau équitable, transparent et rigoureusement pérenne.
    </p>

    <div class="callout callout-rose">
      <strong>Les 6 Règles d'Or du ROUTINI ONE PLAN V4 (Slide 2 &amp; 3) :</strong>
      <ol style="margin: 6px 0 0; padding-left: 18px; line-height: 1.6;">
        <li><strong>Prix Membre (PM) = 90% du Prix Public (PP) :</strong> Remise universelle de 10% pour l'ensemble des distributeurs, quel que soit leur grade.</li>
        <li><strong>Points PV = PP &divide; 10 (1 PV = 10 DH PP) :</strong> Étalon universel mesurant l'activité et le volume de référence.</li>
        <li><strong>Commission Value (CV) = 60% du Prix Membre payé :</strong> Base monétaire exclusive sur laquelle sont calculées toutes les commissions du réseau. Formule étalon : <em>500 DH PP &rarr; 450 DH PM &rarr; 50 PV &rarr; 270 DH CV</em>.</li>
        <li><strong>Commissions Réseau sur CV (sur 3 niveaux max) :</strong>
          Niveau 1 = 10% CV (27 DH) &bull; Niveau 2 = 5% CV (13,50 DH) &bull; Niveau 3 = 3% CV (8,10 DH).</li>
        <li><strong>Qualification Builder :</strong> &ge; 2 000 PV équipe cumulés (seul grade supérieur soumis à un seuil en PV).</li>
        <li><strong>Progression après Builder (Règle 100% Structurelle) :</strong> Aucun seuil PV après Builder ! Leader = 2 Builders actifs &bull; Manager = 2 Leaders actifs &bull; Diamond = 2 Managers actifs &bull; Ambassador = 2 Diamonds actifs.</li>
      </ol>
    </div>

    <h2><span class="section-num">1</span> Tableau des 6 Grades &amp; Conditions d'Activité Mensuelle</h2>
    <p>
      Pour être éligible au versement des commissions du mois, chaque distributeur doit réaliser ses PV personnels propres (Slide 8 &amp; 15) :
    </p>

    <table>
      <thead>
        <tr>
          <th>Grade Routini V4</th>
          <th>Condition de Qualification</th>
          <th>PPV Mensuel Requis</th>
          <th>Équivalent en DH (PM)</th>
          <th>Leadership Max</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="badge badge-dark">PARTNER</span></td>
          <td>Dès l'adhésion (0 DH)</td>
          <td><strong>50 PV</strong></td>
          <td>450 DH (PM)</td>
          <td>- (N1 seul : 10% CV)</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue">BUILDER</span></td>
          <td>&ge; 2 000 PV équipe cumulés</td>
          <td><strong>100 PV</strong></td>
          <td>900 DH (PM)</td>
          <td><strong>+1%</strong> (+ N2 ouvert : 5% CV)</td>
        </tr>
        <tr>
          <td><span class="badge badge-green">LEADER</span></td>
          <td>2 Builders actifs</td>
          <td><strong>200 PV</strong></td>
          <td>1 800 DH (PM)</td>
          <td><strong>+2%</strong> (+ N3 ouvert : 3% CV)</td>
        </tr>
        <tr>
          <td><span class="badge badge-gold">MANAGER</span></td>
          <td>2 Leaders actifs</td>
          <td><strong>400 PV</strong></td>
          <td>3 600 DH (PM)</td>
          <td><strong>+3%</strong> différentiel</td>
        </tr>
        <tr>
          <td><span class="badge badge-blue" style="background:#dbeafe; color:#1e40af;">DIAMOND</span></td>
          <td>2 Managers actifs</td>
          <td><strong>800 PV</strong></td>
          <td>7 200 DH (PM)</td>
          <td><strong>+5%</strong> différentiel</td>
        </tr>
        <tr>
          <td><span class="badge badge-rose">AMBASSADOR</span></td>
          <td>2 Diamonds actifs</td>
          <td><strong>1 600 PV</strong></td>
          <td>14 400 DH (PM)</td>
          <td><strong>+7%</strong> différentiel (Plafond suprême)</td>
        </tr>
      </tbody>
    </table>

    <div class="callout callout-gold">
      <strong>Règle de Sauvegarde &amp; Solidité Financière (Slide 8 &amp; 15) :</strong>
      Si un distributeur n'atteint pas son quota de points personnels dans le mois civil, <strong>aucune commission ne lui est versée ce mois-là</strong>. Son grade historique, ses filleuls et son arbre réseau demeurent intégralement protégés et conservés.
    </div>
  </div>

  <!-- ========================================================================
       PAGE 2 : ACCÈS ET CONSOLE DIRECTION GÉNÉRALE
       ======================================================================== -->
  <div class="page">
    <div class="header-rule">
      <span class="doc-title">Routini eWorld MLM — Manuel d'Utilisation &amp; Recette V4</span>
      <span class="version-tag">Espace Propriétaire</span>
    </div>

    <h1>2. Espace Direction Générale &amp; Identifiants Officiels</h1>

    <div class="grid-2">
      <div class="card" style="border-top: 4px solid #f59e0b;">
        <div class="card-head">
          <strong>👑 Espace Direction (Propriétaire)</strong>
          <span class="badge badge-gold">Super Admin</span>
        </div>
        <p style="font-size: 8.5pt; margin-bottom: 8px;">Accès exclusif au cockpit de pilotage stratégique de l'entreprise :</p>
        <div class="code-box" style="margin-bottom: 6px;">
          <strong>Identifiant :</strong> admin (ou ADMIN001)<br>
          <strong>Mot de passe :</strong> Routini#2026!
        </div>
        <small style="color: #64748b;">Onglet "Direction Générale" &bull; Accès aux réglages catalogue, stress test, ajustements manuels et base Neon Vercel.</small>
      </div>

      <div class="card" style="border-top: 4px solid #be185d;">
        <div class="card-head">
          <strong>💎 Sélecteur Rapide 51 Partenaires</strong>
          <span class="badge badge-rose">Démonstration</span>
        </div>
        <p style="font-size: 8.5pt; margin-bottom: 8px;">Dans la barre supérieure, un menu déroulant permet d'explorer la plateforme avec la vue de chaque rang :</p>
        <ul style="font-size: 8pt; margin: 0; padding-left: 16px; line-height: 1.5;">
          <li><strong>Ambassador :</strong> Karim Benali (818204921)</li>
          <li><strong>Diamond :</strong> Mehdi Alami (818206330)</li>
          <li><strong>Manager :</strong> Nadia Berrada (818210552)</li>
          <li><strong>Leader :</strong> Siham Bouazza (818217123)</li>
          <li><strong>Builder :</strong> Ibtissam Kadiri (818229345)</li>
          <li><strong>Partner Inactif :</strong> Driss Bensaid (818252678)</li>
        </ul>
      </div>
    </div>

    <h2><span class="section-num">2</span> Les Fonctions Clés de la Direction Générale</h2>

    <div class="grid-3">
      <div class="card">
        <strong>1. Catalogue &amp; Packs</strong>
        <p style="font-size: 8pt; color: #475569; margin-top: 4px;">
          Création de soins solo ou de coffrets rituels. Saisie du Prix Public (PP) avec calcul automatique instantané du PM (90%), PV (PP/10) et CV (60% PM). Activation d'offres promotionnelles en 1 clic.
        </p>
      </div>
      <div class="card">
        <strong>2. Stress Test Financier</strong>
        <p style="font-size: 8pt; color: #475569; margin-top: 4px;">
          Simulateur en direct des sorties variables (N1 + N2 + N3 + Leadership). Prouve mathématiquement que les commissions ne dépassent jamais 15% du CA membre, préservant la rentabilité brute.
        </p>
      </div>
      <div class="card">
        <strong>3. Pilotage du Réseau</strong>
        <p style="font-size: 8pt; color: #475569; margin-top: 4px;">
          Surveillance en direct des 51 partenaires, diagnostic de leur statut d'activité, ajustement ponctuel des points (PV/CV), solde des portefeuilles et attribution manuelle de rangs.
        </p>
      </div>
    </div>

    <h2><span class="section-num">3</span> Les 3 Parcours Commerciaux Officiels (Slide 10)</h2>
    <p>
      La plateforme sépare nettement les flux de vente pour garantir la clarté juridique et comptable :
    </p>

    <table>
      <thead>
        <tr>
          <th>Parcours Commercial</th>
          <th>Prix Appliqué</th>
          <th>Marge Immédiate</th>
          <th>Impact Réseau</th>
          <th>Points &amp; Commissions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. Client Direct Routini</strong></td>
          <td>100% Prix Public (PP)</td>
          <td>100% encaissé par la marque</td>
          <td>0% Réseau</td>
          <td>Fidélité client (20 pts = 10 DH) &bull; 0 commission réseau.</td>
        </tr>
        <tr>
          <td><strong>2. Client Rattaché</strong></td>
          <td>100% Prix Public (PP)</td>
          <td><strong>10% direct</strong> au Partner vendeur</td>
          <td>Génère CV Réseau</td>
          <td>10% cash immédiat dans le portefeuille + CV distribué à la lignée.</td>
        </tr>
        <tr>
          <td><strong>3. Achat Perso Partenaire</strong></td>
          <td><strong>90% Prix Public (PM)</strong></td>
          <td>Remise de 10% à l'achat</td>
          <td>Crédite PV Activité</td>
          <td>0% auto-commission (Slide 5). Valide le quota PPV du mois.</td>
        </tr>
      </tbody>
    </table>

    <div class="callout callout-green">
      <strong>Garde-Fou Absolu Anti-Pertes (Slide 16 &amp; 17) :</strong>
      Le système interdit techniquement l'auto-commission (un distributeur ne touche jamais de commission N1 sur son propre réassort). De plus, un vendeur touche soit sa commission de vente (10% DH), soit sa position réseau, mais jamais les deux simultanément sur le même euro.
    </div>
  </div>

  <!-- ========================================================================
       PAGE 3 : MODULES DISTRIBUTEURS ET CLIENTS DIRECTS
       ======================================================================== -->
  <div class="page">
    <div class="header-rule">
      <span class="doc-title">Routini eWorld MLM — Manuel d'Utilisation &amp; Recette V4</span>
      <span class="version-tag">Modules Applicatifs</span>
    </div>

    <h1>3. Modules Opérationnels Distributeurs &amp; Clients</h1>

    <h2><span class="section-num">1</span> Tableau de Bord &amp; Arbre Généalogique</h2>
    <div class="grid-2">
      <div>
        <p><strong>Tableau de Bord Distributeur :</strong></p>
        <ul style="font-size: 8.5pt; padding-left: 18px; margin: 4px 0 10px;">
          <li>Barre de progression en temps réel vers le grade supérieur.</li>
          <li>Indicateurs clés : Points Perso (PPV), Volume Équipe (GPV), Base Commission (CV) et Solde Portefeuille E-Point.</li>
          <li>Historique des dernières commandes avec accès direct aux factures imprimables et numérotées.</li>
        </ul>
      </div>
      <div>
        <p><strong>Arbre Généalogique Interactif :</strong></p>
        <ul style="font-size: 8.5pt; padding-left: 18px; margin: 4px 0 10px;">
          <li><strong>Vue Graphique SVG :</strong> Navigation visuelle arborescente, déploiement/repliement des branches en 1 clic.</li>
          <li>Curseur de zoom précis (slider) pour inspecter l'ensemble du réseau sans débordement.</li>
          <li><strong>Vue Tableau Descendance :</strong> Filtrage rapide par nom, code ou ville avec détail du statut de chaque filleul.</li>
        </ul>
      </div>
    </div>

    <h2><span class="section-num">2</span> Boutique Cosmétiques &amp; Facturation</h2>
    <p>
      Le catalogue propose des soins d'excellence (soins visage, anti-âge, huile d'argan pure, packs découverte). Chaque produit affiche de façon limpide son Prix Public (PP), son Prix Membre (PM), ses points PV et sa base CV.
    </p>
    <div class="callout callout-rose">
      <strong>Règlement des Commandes :</strong>
      4 modes de paiement sont pris en charge : <strong>Portefeuille E-Point</strong> (débit direct du solde commissions), <strong>Carte Bancaire CMI</strong> (passerelle sécurisée marocaine), <strong>Paiement à la Livraison</strong> et <strong>Virement Bancaire</strong> (Attijariwafa, CIH, BCP). À chaque commande validée, une facture professionnelle au format officiel est automatiquement générée.
    </div>

    <h2><span class="section-num">3</span> Inscription Partenaire à 0 DH (Slide 2 &amp; 10)</h2>
    <p>
      Conformément aux principes de vente directe éthique, <strong>l'inscription chez Routini est 100% gratuite (0 DH)</strong>. Aucun achat de kit n'est imposé pour devenir distributeur. Le candidat peut néanmoins opter immédiatement pour un <em>Pack de Démarrage Officiel V4</em> (ex: Duo Rituel à 450 DH PM / 50 PV ou Pack Glow à 900 DH PM / 100 PV) pour qualifier directement son premier mois d'activité.
    </p>

    <h2><span class="section-num">4</span> Espace Client Direct Privilège (Sans Arbre MLM)</h2>
    <p>
      Spécifiquement conçu pour les clients qui achètent des soins pour leur usage personnel sans souhaiter intégrer le réseau :
    </p>
    <table>
      <thead>
        <tr>
          <th>Fonctionnalité Client Direct</th>
          <th>Description &amp; Règle V4</th>
          <th>Bénéfice Marque</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Zéro Arbre MLM</strong></td>
          <td>L'interface masque totalement les notions d'arbre généalogique, de filleuls et de matrice réseau.</td>
          <td>Expérience rassurante type e-commerce de luxe.</td>
        </tr>
        <tr>
          <td><strong>Points Fidélité</strong></td>
          <td><strong>+50 pts offerts</strong> à l'inscription. Puis 10% du montant crédité en points fidélité (20 pts = 10 DH de remise).</td>
          <td>Fidélisation forte et réachat récurrent.</td>
        </tr>
        <tr>
          <td><strong>Suivi Amana Express</strong></td>
          <td>Génération d'un numéro de suivi colis (ex: <code>AMN-RBT-88402</code>) avec statut d'acheminement sous 24-48h.</td>
          <td>Transparence logistique sur tout le Maroc.</td>
        </tr>
        <tr>
          <td><strong>Parrainage Client (12 mois)</strong></td>
          <td>Lien et code personnel à partager : -10% immédiat pour l'ami(e) et +50 points pour le parrain pendant 12 mois.</td>
          <td>Croissance organique sans coût d'acquisition.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ========================================================================
       PAGE 4 : PLAN DE TEST DE SCÉNARIOS (VUE D'ENSEMBLE)
       ======================================================================== -->
  <div class="page">
    <div class="header-rule">
      <span class="doc-title">Routini eWorld MLM — Plan de Test &amp; Recette V4</span>
      <span class="version-tag">Protocole de Validation</span>
    </div>

    <h1>4. Plan de Test &amp; Scénarios de Validation</h1>
    <p>
      Ce protocole de test a été conçu pour permettre au Propriétaire de tester personnellement et de valider l'intégralité du système en moins de <strong>25 minutes</strong>. Chaque scénario cible un composant critique du modèle commercial et technique.
    </p>

    <h2><span class="section-num">&bull;</span> Grille Synthétique des 9 Scénarios de Recette</h2>

    <table class="table-compact">
      <thead>
        <tr>
          <th style="width: 35px;">N&deg;</th>
          <th>Scénario de Test</th>
          <th>Périmètre &amp; Objectif</th>
          <th>Profil Utilisé</th>
          <th>Durée</th>
          <th>Validation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>S-01</strong></td>
          <td><strong>Sécurité Direction</strong></td>
          <td>Vérification du mot de passe admin et du refus des accès non autorisés.</td>
          <td><code>admin</code></td>
          <td>2 min</td>
          <td><span class="badge badge-green">&check; Conforme</span></td>
        </tr>
        <tr>
          <td><strong>S-02</strong></td>
          <td><strong>Formules Catalogue V4</strong></td>
          <td>Création d'un soin avec vérification de PM (90%), PV (PP/10) et CV (60%).</td>
          <td>Direction Générale</td>
          <td>3 min</td>
          <td><span class="badge badge-green">&check; Conforme</span></td>
        </tr>
        <tr>
          <td><strong>S-03</strong></td>
          <td><strong>Stress Test Financier</strong></td>
          <td>Contrôle du payout variable réseau &le; 15% sur panier étalon de 500 DH.</td>
          <td>Direction Générale</td>
          <td>2 min</td>
          <td><span class="badge badge-green">&check; Conforme</span></td>
        </tr>
        <tr>
          <td><strong>S-04</strong></td>
          <td><strong>Commande &amp; Facture</strong></td>
          <td>Achat au Prix Membre avec déduction solde E-Point et édition de la facture.</td>
          <td>Karim Benali (Ambassador)</td>
          <td>4 min</td>
          <td><span class="badge badge-green">&check; Conforme</span></td>
        </tr>
        <tr>
          <td><strong>S-05</strong></td>
          <td><strong>Activité Mensuelle</strong></td>
          <td>Vérification du gel des commissions si PPV &lt; seuil du grade (Driss Bensaid).</td>
          <td>Driss Bensaid (Inactif)</td>
          <td>3 min</td>
          <td><span class="badge badge-green">&check; Conforme</span></td>
        </tr>
        <tr>
          <td><strong>S-06</strong></td>
          <td><strong>Arbre Généalogique</strong></td>
          <td>Test de la vue graphique SVG, du slider de zoom et du filtre descendance.</td>
          <td>Karim Benali / Direction</td>
          <td>2 min</td>
          <td><span class="badge badge-green">&check; Conforme</span></td>
        </tr>
        <tr>
          <td><strong>S-07</strong></td>
          <td><strong>Recrutement à 0 DH</strong></td>
          <td>Adhésion d'un distributeur avec parrainage direct et pack optionnel.</td>
          <td>Nadia Berrada (Manager)</td>
          <td>3 min</td>
          <td><span class="badge badge-green">&check; Conforme</span></td>
        </tr>
        <tr>
          <td><strong>S-08</strong></td>
          <td><strong>Client Direct &amp; Amana</strong></td>
          <td>Création compte client sans arbre, crédit +50 pts fidélité et suivi colis.</td>
          <td>Client Privilège</td>
          <td>4 min</td>
          <td><span class="badge badge-green">&check; Conforme</span></td>
        </tr>
        <tr>
          <td><strong>S-09</strong></td>
          <td><strong>Multilingue (Arabe RTL)</strong></td>
          <td>Bascule en langue arabe (disposition inversée RTL) et test mobile tactile.</td>
          <td>Tous profils</td>
          <td>2 min</td>
          <td><span class="badge badge-green">&check; Conforme</span></td>
        </tr>
      </tbody>
    </table>

    <div class="callout callout-gold">
      <strong>Matériel Recommandé pour les Tests :</strong>
      Un ordinateur de bureau ou ordinateur portable avec navigateur moderne (Google Chrome, Microsoft Edge, Safari ou Firefox), et un smartphone pour valider l'ergonomie mobile tactile.
    </div>
  </div>

  <!-- ========================================================================
       PAGE 5 : SCÉNARIOS DÉTAILLÉS 1 À 4
       ======================================================================== -->
  <div class="page">
    <div class="header-rule">
      <span class="doc-title">Routini eWorld MLM — Fiches Scénarios de Test (1 à 4)</span>
      <span class="version-tag">Validation Technique</span>
    </div>

    <!-- SCÉNARIO 1 -->
    <div class="scenario-card">
      <div class="scenario-header">
        <div>
          <h3 class="scenario-title">Scénario S-01 : Authentification Sécurisée de la Direction</h3>
          <div class="scenario-meta">Objectif : S'assurer de l'inviolabilité du compte Fondateur et de l'accès exclusif à la console de gestion.</div>
        </div>
        <span class="badge badge-rose">Priorité Haute</span>
      </div>
      <ol class="step-list">
        <li>Sur la page d'accueil de l'application, cliquer sur le 3ème onglet <strong>Direction Générale</strong> (icône couronne dorée).</li>
        <li>Taper l'identifiant <code>admin</code> et saisir un mot de passe erroné (ex: <code>123456</code>). Cliquer sur <em>Connexion</em>.</li>
        <li>Constater qu'une notification rouge refuse la connexion et bloque l'accès.</li>
        <li>Saisir le mot de passe confidentiel officiel : <code>Routini#2026!</code>. Valider.</li>
      </ol>
      <div class="expected-box">
        <strong>Résultat Attendu &amp; Critère d'Acceptation :</strong>
        Connexion immédiate. La barre supérieure affiche le badge doré <em>PROPRIÉTAIRE</em> avec la mention <em>Direction Générale Routini (ADMIN001)</em>. L'écran bascule directement sur le tableau de bord d'administration générale.
      </div>
    </div>

    <!-- SCÉNARIO 2 -->
    <div class="scenario-card">
      <div class="scenario-header">
        <div>
          <h3 class="scenario-title">Scénario S-02 : Création de Produit &amp; Automatismes V4</h3>
          <div class="scenario-meta">Objectif : Valider l'application automatique des formules mathématiques officielles lors de l'ajout d'un soin.</div>
        </div>
        <span class="badge badge-blue">Catalogue V4</span>
      </div>
      <ol class="step-list">
        <li>Dans l'espace Direction Générale, descendre jusqu'au tableau <em>Catalogue des Soins &amp; Packs</em>.</li>
        <li>Cliquer sur le bouton <strong>Créer Nouveau Produit</strong>.</li>
        <li>Renseigner : Nom = <code>Émulsion Révélatrice Niacinamide</code> &bull; Catégorie = <code>Soins Visage &amp; Sérums</code>.</li>
        <li>Dans le champ <strong>Prix Public (PP)</strong>, saisir <code>400</code> DH.</li>
        <li>Vérifier immédiatement les valeurs calculées dynamiquement :
          PM affiché = <strong>360 DH</strong> (90%) &bull; PV = <strong>40 PV</strong> (400/10) &bull; Base CV = <strong>216 CV</strong> (360 &times; 60%).</li>
        <li>Indiquer un stock de <code>50</code> unités et cliquer sur <em>Enregistrer</em>.</li>
        <li>Ouvrir ensuite l'onglet <strong>Boutique Cosmétiques</strong> pour vérifier l'apparition du soin.</li>
      </ol>
      <div class="expected-box">
        <strong>Résultat Attendu &amp; Critère d'Acceptation :</strong>
        Le produit est créé sans erreur et apparaît instantanément dans la boutique avec son badge 40 PV, sa base de 216 CV et son prix membre à 360 DH.
      </div>
    </div>

    <!-- SCÉNARIO 3 -->
    <div class="scenario-card">
      <div class="scenario-header">
        <div>
          <h3 class="scenario-title">Scénario S-03 : Stress Test Financier &amp; Contrôle du Payout</h3>
          <div class="scenario-meta">Objectif : Confirmer la rentabilité mathématique et le plafonnement des commissions réseau &le; 15%.</div>
        </div>
        <span class="badge badge-gold">Solidité Financière</span>
      </div>
      <ol class="step-list">
        <li>Dans l'espace Direction Générale, se rendre à la section <em>Solidité Financière (Slide 15 &amp; 16)</em>.</li>
        <li>Laisser ou saisir dans le champ de commande étalon : <code>500</code> DH Prix Public (450 DH Prix Membre, 270 CV).</li>
        <li>Examiner la décomposition des sorties variables calculées par le moteur :
          N1 (10% CV) = <strong>27,00 DH</strong> &bull; N2 (5% CV) = <strong>13,50 DH</strong> &bull; N3 (3% CV) = <strong>8,10 DH</strong> &bull; Leadership Max (7% CV) = <strong>18,90 DH</strong>.</li>
        <li>Observer le total des sorties variables réseau : <strong>67,50 DH</strong>, soit exactement <strong>15,0%</strong> du CA membre encaissé.</li>
      </ol>
      <div class="expected-box">
        <strong>Résultat Attendu &amp; Critère d'Acceptation :</strong>
        L'indicateur affiche en vert foncé : <em>✓ Solidité Validée : Payout de 15.0% &le; Plafond cible de 22%. Marge préservée !</em>
      </div>
    </div>

    <!-- SCÉNARIO 4 -->
    <div class="scenario-card">
      <div class="scenario-header">
        <div>
          <h3 class="scenario-title">Scénario S-04 : Commande E-Shop &amp; Génération de Facture</h3>
          <div class="scenario-meta">Objectif : Tester le parcours d'achat membre, le débit du portefeuille E-Point et la facture PDF.</div>
        </div>
        <span class="badge badge-green">E-Commerce &amp; Facturation</span>
      </div>
      <ol class="step-list">
        <li>Dans la barre rapide en haut, ouvrir le sélecteur de membre et choisir <strong>Karim Benali</strong> (Ambassador).</li>
        <li>Aller dans la <strong>Boutique Cosmétiques</strong>.</li>
        <li>Sélectionner le canal : <code>Achat Perso Partenaire (Prix Membre 90%)</code>.</li>
        <li>Ajouter au panier le <strong>Duo Rituel Étalon ONE PLAN</strong> (450 DH PM, +50 PV, +270 CV).</li>
        <li>Choisir le mode de paiement : <code>Portefeuille E-Point</code>. Cliquer sur <em>Valider et Confirmer</em>.</li>
        <li>Revenir sur le <strong>Tableau de Bord</strong> et cliquer sur le bouton <strong>Facture</strong> de la commande.</li>
      </ol>
      <div class="expected-box">
        <strong>Résultat Attendu &amp; Critère d'Acceptation :</strong>
        Commande enregistrée avec succès. Le solde du portefeuille passe de 19 850 DH à 19 400 DH (-450 DH). La facture s'affiche avec en-tête officiel Routini, décompte PV/CV et bouton direct d'impression.
      </div>
    </div>
  </div>

  <!-- ========================================================================
       PAGE 6 : SCÉNARIOS DÉTAILLÉS 5 À 9 ET SIGNATURE
       ======================================================================== -->
  <div class="page">
    <div class="header-rule">
      <span class="doc-title">Routini eWorld MLM — Fiches Scénarios de Test (5 à 9)</span>
      <span class="version-tag">Validation Réseau &amp; Recette</span>
    </div>

    <!-- SCÉNARIO 5 -->
    <div class="scenario-card">
      <div class="scenario-header">
        <div>
          <h3 class="scenario-title">Scénario S-05 : Règle d'Activité Mensuelle &amp; Gel Commissions</h3>
          <div class="scenario-meta">Objectif : Démontrer la règle stricte de non-versement des commissions si le PPV mensuel est insuffisant (Slide 8/15).</div>
        </div>
        <span class="badge badge-rose">Garde-Fou MLM</span>
      </div>
      <ol class="step-list">
        <li>Dans la barre rapide supérieure, choisir <strong>Driss Bensaid</strong> (Partner disposant seulement de 20 PV).</li>
        <li>Cliquer sur l'onglet <strong>Commissions &amp; E-Point</strong>.</li>
        <li>Constater l'alerte rouge : <em>Activité Personnelle Mensuelle Non Atteinte (Règle Slide 8 &amp; 15)</em>.</li>
        <li>Vérifier l'explication : Driss a 20 PV sur les 50 PV requis pour son grade. Ses commissions sont gelées.</li>
        <li>Observer la présence du bouton d'action : <code>Commander pour Activer (+30 PV)</code>.</li>
      </ol>
      <div class="expected-box">
        <strong>Résultat Attendu &amp; Critère d'Acceptation :</strong>
        Conformité absolue avec le document officiel. Le distributeur inactif est alerté avec précision sans perdre son grade ni son réseau.
      </div>
    </div>

    <!-- SCÉNARIO 6 -->
    <div class="scenario-card">
      <div class="scenario-header">
        <div>
          <h3 class="scenario-title">Scénario S-06 : Arbre Généalogique &amp; Visualisation Descendance</h3>
          <div class="scenario-meta">Objectif : Vérifier la manipulation fluide du réseau graphique SVG et les filtres de recherche.</div>
        </div>
        <span class="badge badge-blue">Arbre Généalogique</span>
      </div>
      <ol class="step-list">
        <li>Sélectionner le compte de Karim Benali ou Direction. Ouvrir <strong>Arbre Généalogique</strong>.</li>
        <li>Faire glisser le <strong>curseur de zoom</strong> (slider) de gauche à droite pour tester l'agrandissement et la réduction.</li>
        <li>Cliquer sur le nœud d'un distributeur pour replier sa branche, puis cliquer à nouveau pour la déplier.</li>
        <li>Basculer sur le mode <strong>Tableau Descendance</strong> en haut à droite. Taper <code>Nadia</code> dans la recherche.</li>
      </ol>
      <div class="expected-box">
        <strong>Résultat Attendu &amp; Critère d'Acceptation :</strong>
        Rendu graphique fluide sans aucun chevauchement de nœuds. Le tableau filtre immédiatement Nadia Berrada avec son rang de Manager et sa ville.
      </div>
    </div>

    <!-- SCÉNARIOS 7, 8 & 9 EN GRID COMPACT -->
    <div class="grid-2">
      <div class="scenario-card" style="margin-bottom: 0;">
        <h4 style="color: #831843; font-size: 9.5pt; margin-bottom: 4px;">Scénario S-07 : Adhésion Partenaire (0 DH)</h4>
        <p style="font-size: 8pt; color: #475569;">
          1. Ouvrir l'onglet <em>Nouveau Distributeur</em> sous le parrainage de Nadia Berrada.<br>
          2. Remplir Nom, CIN, Email, Téléphone et Ville.<br>
          3. Choisir la formule <em>Adhésion Standard (0 DH)</em> ou <em>Pack Glow (900 DH PM)</em>.<br>
          4. Valider l'adhésion : un code unique à 9 chiffres est attribué et le membre apparaît sous Nadia.
        </p>
        <span class="badge badge-green">&check; Inscription 0 DH Validée</span>
      </div>

      <div class="scenario-card" style="margin-bottom: 0;">
        <h4 style="color: #831843; font-size: 9.5pt; margin-bottom: 4px;">Scénario S-08 : Client Direct &amp; Suivi Amana</h4>
        <p style="font-size: 8pt; color: #475569;">
          1. Se déconnecter et cliquer sur l'onglet <em>Espace Client</em>.<br>
          2. Cliquer sur <em>Créer mon Compte Client</em> (formulaire rapide).<br>
          3. Constater l'attribution immédiate de <strong>+50 points fidélité</strong>.<br>
          4. Vérifier la génération du numéro de suivi Amana Express (livraison 24-48h partout au Maroc).
        </p>
        <span class="badge badge-green">&check; Parcours Client Validé</span>
      </div>
    </div>

    <div class="scenario-card" style="margin-top: 12px; margin-bottom: 16px;">
      <h4 style="color: #831843; font-size: 9.5pt; margin-bottom: 4px;">Scénario S-09 : Adaptation Culturelle Multilingue (Arabe RTL) &amp; Ergonomie Mobile</h4>
      <p style="font-size: 8.5pt; color: #475569; margin-bottom: 6px;">
        1. En haut à droite, cliquer sur le drapeau marocain <strong>AR</strong> : l'ensemble de la plateforme bascule immédiatement en arabe avec orientation inversée de droite à gauche (RTL), alignement des menus et typographies adaptées.<br>
        2. Repasser en <strong>FR</strong>. Réduire la largeur du navigateur ou tester sur smartphone : la barre inférieure tactile apparaît avec panier flottant interactif.
      </p>
      <span class="badge badge-green">&check; Multilingue &amp; 100% Responsive Validés</span>
    </div>

    <!-- PROCÈS-VERBAL DE VALIDATION ET SIGNATURES -->
    <h2 style="margin-top: 20px;"><span class="section-num">&bull;</span> Procès-Verbal de Recette &amp; Validation Finale</h2>
    <p style="font-size: 8.5pt;">
      Par la présente, la Direction Générale et le Propriétaire attestent avoir procédé au déroulement des 9 scénarios de test ci-dessus et certifient la parfaite conformité fonctionnelle et financière de la plateforme <strong>Routini eWorld MLM V4</strong>.
    </p>

    <div class="signature-grid">
      <div class="signature-box">
        <strong style="color: #0f172a; font-size: 8.5pt; display: block; margin-bottom: 4px;">Pour l'Équipe de Développement Technique :</strong>
        <p style="font-size: 7.8pt; color: #64748b;">Plateforme livrée, testée et conforme aux 18 slides officielles du ROUTINI ONE PLAN V4.</p>
        <div style="margin-top: 35px; font-size: 8pt; color: #1e293b;">
          <strong>Date :</strong> 03 Octobre 2026<br>
          <strong>Signature &amp; Cachet :</strong> <em>Validé pour Recette Définitive</em>
        </div>
      </div>

      <div class="signature-box">
        <strong style="color: #831843; font-size: 8.5pt; display: block; margin-bottom: 4px;">Pour la Direction Générale &amp; Propriétaire Routini :</strong>
        <p style="font-size: 7.8pt; color: #64748b;">Validation des règles commerciales, marges bénéficiaires et portails partenaires.</p>
        <div style="margin-top: 35px; font-size: 8pt; color: #1e293b;">
          <strong>Date :</strong> .... / .... / 2026<br>
          <strong>Signature du Propriétaire :</strong>
        </div>
      </div>
    </div>
  </div>

</body>
</html>
"""

    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"HTML temporaire genere : {temp_html} ({os.path.getsize(temp_html)} octets)")

    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    ]
    edge_exe = None
    for ep in edge_paths:
        if os.path.exists(ep):
            edge_exe = ep
            break

    if not edge_exe:
        print("Erreur: Microsoft Edge est introuvable pour la conversion PDF.")
        sys.exit(1)

    print(f"Execution de Edge Headless avec : {edge_exe}")

    cmd = [
        edge_exe,
        "--headless",
        "--disable-gpu",
        f"--print-to-pdf={output_pdf}",
        "--no-pdf-header-footer",
        temp_html
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    time.sleep(2)

    if os.path.exists(output_pdf):
        size = os.path.getsize(output_pdf)
        print(f"SUCCES : Le fichier PDF officiel a ete cree sur le Bureau :")
        print(f"Emplacement : {output_pdf}")
        print(f"Taille : {size} octets ({round(size / 1024, 1)} Ko)")
    else:
        print(f"Erreur : Le fichier PDF n'a pas pu etre genere. Code sortie : {result.returncode}")
        print(f"Stderr : {result.stderr}")
        sys.exit(1)

if __name__ == "__main__":
    main()
