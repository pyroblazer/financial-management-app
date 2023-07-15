# Deployment Guide — MonsterASP.net

This guide covers deploying the Financial Management App (ASP.NET Core 8 API + React frontend) to [MonsterASP.net](https://www.monsterasp.net/) free hosting using Visual Studio.

---

## Prerequisites

- A [MonsterASP.net](https://www.monsterasp.net/ASP.NET-Freehosting/) account (free tier works)
- Visual Studio 2022 (17.0+) with the **ASP.NET and web development** workload
- A [Financial Modeling Prep](https://site.financialmodelingprep.com/) API key
- Node.js 16+ and npm installed (for frontend build)

---

## Architecture Overview

| Component | Technology | Hosting |
|---|---|---|
| Backend API | ASP.NET Core 8.0 Web API | MonsterASP.net (WebDeploy) |
| Frontend | React 18 (TypeScript) | MonsterASP.net (static files) or separately |
| Database | MySQL 8 | MonsterASP.net WebMySQL |
| Auth | JWT Bearer + ASP.NET Core Identity | N/A (self-contained) |

---

## Step 1 — Create a MonsterASP.net Account

1. Go to [MonsterASP.net Free Hosting](https://www.monsterasp.net/ASP.NET-Freehosting/) and sign up.
2. Log into the [Hosting Control Panel](https://admin.monsterasp.net/).

---

## Step 2 — Create a Website

1. In the Control Panel, click **Create Website**.
2. Choose a domain name (e.g., `financial-app.monsteraspnet.com` or use a custom domain).
3. Select **.NET 8** as the runtime.
4. Note your site URL — you'll need it later (e.g., `https://financial-app.monsteraspnet.com`).

---

## Step 3 — Create a MySQL Database

This app uses MySQL, not MSSQL.

1. In the Control Panel, navigate to **Databases** and create a new **MySQL** database.
2. Note the connection details provided:
   - **Server host** (e.g., `mysql.monsterasp.net`)
   - **Database name**
   - **Username**
   - **Password**
3. You can manage the database via **WebMySQL** at [webmysql.monsterasp.net](https://webmysql.monsterasp.net/) (phpMyAdmin/Adminer).

---

## Step 4 — Configure appsettings.json

Create or update `api/appsettings.json` (this file is gitignored) with your MonsterASP details:

```json
{
  "ConnectionStrings": {
    "MySQLConnection": "Server=<your-mysql-host>;Database=<your-db-name>;Uid=<your-db-user>;Pwd=<your-db-password>;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "FMPKey": "<your-financial-modeling-prep-api-key>",
  "JWT": {
    "Issuer": "https://<your-monsterasp-site-url>",
    "Audience": "https://<your-monsterasp-site-url>",
    "SigningKey": "<generate-a-secure-random-string-at-least-32-chars>"
  }
}
```

> **Important:** Change `JWT:Issuer` and `JWT:Audience` from `localhost` to your MonsterASP site URL. Generate a strong signing key (e.g., use a GUID or random 64+ character string).

---

## Step 5 — Activate WebDeploy and Download Publish Profile

1. In the MonsterASP Control Panel, go to your website settings.
2. Activate the **WebDeploy** account.
3. Download the **WebDeploy publishing profile** (`.publishSettings` file).

---

## Step 6 — Publish the Backend API via Visual Studio

1. Open `FinancialManagementApp.sln` in **Visual Studio 2022**.
2. In **Solution Explorer**, right-click the `api` project and select **Publish**.
3. Select **Import Profile** and choose the `.publishSettings` file downloaded from MonsterASP.
4. Click **Show all settings** and verify:
   - **Configuration:** `Release`
   - **Target Framework:** `net8.0`
   - **Deployment Mode:** `Framework-Dependent` (MonsterASP provides the .NET 8 runtime)
   - **Target Runtime:** leave as-is or match the server
5. Click **Publish**. Visual Studio will build and deploy the API via WebDeploy.
6. Wait for the output window to confirm success.

---

## Step 7 — Run Database Migrations

After the first deployment, the database tables need to be created. Since the app uses Entity Framework Core migrations, apply them with one of these methods:

### Option A — Apply migrations before publishing (recommended)

In a terminal at the `api/` directory:

```bash
dotnet ef database update --connection "Server=<your-mysql-host>;Database=<your-db-name>;Uid=<your-db-user>;Pwd=<your-db-password>;"
```

### Option B — Apply migrations at startup

Add this to `Program.cs` before `app.Run()` to auto-migrate on startup:

```csharp
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
    db.Database.Migrate();
}
```

Then re-publish the API from Visual Studio (repeat Step 6).

---

## Step 8 — Build and Deploy the Frontend

### Build the React app

1. Update `frontend/.env` with your deployed API URL:

```env
REACT_APP_API_KEY=<your-financial-modeling-prep-api-key>
REACT_APP_API_URL=https://<your-monsterasp-site-url>
```

2. Build the production bundle:

```bash
cd frontend
npm install
npm run build
```

This creates a `frontend/build/` folder with static files.

### Deploy static files

#### Option A — Serve from MonsterASP (same domain)

1. In Visual Studio, right-click the `api` project and select **Publish**.
2. Under **Publish**, click **Edit** on the deployment settings.
3. In the **File Publish Options**, or manually copy the contents of `frontend/build/` into the published `wwwroot/` folder of the API.

   Alternatively, copy the contents of `frontend/build/` into `api/wwwroot/` before publishing, then re-publish from Visual Studio. The static files will be served alongside the API.

4. To enable static file serving, add this to `Program.cs` before `app.MapControllers()`:

```csharp
app.UseDefaultFiles();
app.UseStaticFiles();
```

#### Option B — Deploy frontend separately

Upload the `frontend/build/` contents to any static hosting service (Netlify, Vercel, GitHub Pages, etc.) and point `REACT_APP_API_URL` to your MonsterASP API.

> **Note:** If hosting the frontend on a different domain, CORS is already configured to allow all origins (`AllowAllOrigins` policy).

---

## Step 9 — Verify the Deployment

1. Open your MonsterASP site URL in a browser.
2. **API check:** Visit `https://<your-site-url>/swagger/index.html` to see the Swagger UI and test endpoints.
3. **Frontend check:** If serving static files from the same site, the React app should load at the root URL.
4. **Register a user** via the app or Swagger to confirm the database connection works.
5. **Test the portfolio flow:** Search for a stock, add it to your portfolio, leave a comment.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| **500 error on startup** | Check `appsettings.json` — ensure the MySQL connection string, JWT config, and FMP key are correct. |
| **Swagger returns 404** | Swagger is enabled for all environments (no `IsDevelopment()` check). If it's not loading, the deployment may have failed — re-publish. |
| **Database connection fails** | Verify the MySQL host, database name, username, and password. Ensure remote connections are enabled in the MonsterASP Control Panel. |
| **JWT auth fails** | Ensure `JWT:Issuer` and `JWT:Audience` match your deployed site URL exactly (including `https://`). |
| **CORS errors** | The app uses `AllowAllOrigins`. If you see CORS errors, the API may not be running — check the MonsterASP logs. |
| **Frontend can't reach API** | Verify `REACT_APP_API_URL` in `frontend/.env` matches your deployed API URL. You must rebuild (`npm run build`) after changing env vars. |
| **Static files not served** | Ensure `app.UseDefaultFiles()` and `app.UseStaticFiles()` are in `Program.cs` and the build output is in `wwwroot/`. |

---

## Updating the Deployment

To update after code changes:

1. **Backend:** Right-click the `api` project in Visual Studio and click **Publish** (the profile is saved, so it's one click after initial setup).
2. **Frontend:** Run `npm run build` in the `frontend/` directory, then copy the `build/` contents to `wwwroot/` and re-publish.

---

## Useful Links

- [MonsterASP.net Free Hosting](https://www.monsterasp.net/ASP.NET-Freehosting/)
- [MonsterASP Hosting Control Panel](https://admin.monsterasp.net/)
- [MonsterASP WebMySQL](https://webmysql.monsterasp.net/)
- [Official Deployment Docs](https://help.monsterasp.net/books/deploy/page/how-to-deploy-net-core-web-application-using-visual-studio)
- [MonsterASP Community Forum](https://forum.monsterasp.net/)
