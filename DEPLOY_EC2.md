# Deploying a Next.js Application to AWS EC2 (Ubuntu)

This guide provides step-by-step instructions to deploy your Next.js application to an AWS EC2 instance running Ubuntu.

## Prerequisites

Before you begin, ensure you have the following:

*   An **AWS Account**.
*   Your **Next.js project** ready for deployment.
*   **Node.js** and **npm** (or yarn/pnpm) installed on your local machine.
*   An **SSH client**:
    *   **macOS/Linux**: The built-in terminal is sufficient.
    *   **Windows**: You can use WSL (Windows Subsystem for Linux) or a client like [PuTTY](https://www.putty.org/).

---

## Step 1: Create a Production Build

First, you need to create an optimized, production-ready build of your Next.js application. This command compiles your code and bundles it into a `.next` folder.

In your project's root directory, run:

```bash
npm run build
```

---

## Step 2: Launch an AWS EC2 Instance

Next, we'll set up the virtual server on AWS.

1.  **Navigate to the EC2 Dashboard**: Log in to your AWS Management Console and go to the EC2 service.
2.  **Launch Instance**: Click the "Launch instances" button.
3.  **Choose an AMI (Amazon Machine Image)**: Select **Ubuntu**. The latest LTS version is a good choice and is often free-tier eligible.
4.  **Choose an Instance Type**: Select `t2.micro`, which is part of the AWS Free Tier and suitable for small applications.
5.  **Create a Key Pair**: This is crucial for securely connecting to your instance.
    *   Click "Create new key pair".
    *   Give it a memorable name (e.g., `my-app-key`).
    *   Choose the **.pem** format for macOS/Linux/WSL or **.ppk** for PuTTY on Windows.
    *   Click "Create key pair". Your browser will download the file.
    *   **Important**: Store this file in a secure and easily accessible location. You cannot download it again.
6.  **Configure Security Group**: This acts as a virtual firewall for your instance.
    *   In the "Network settings" panel, click "Edit".
    *   Add the following inbound rules to allow traffic:
        *   **SSH** (Port 22): Allows you to connect to your instance. For better security, set the "Source type" to "My IP".
        *   **HTTP** (Port 80): Allows web traffic from anywhere. Set "Source type" to "Anywhere".
        *   **HTTPS** (Port 443): Allows secure web traffic from anywhere. Set "Source type" to "Anywhere".
7.  **Launch the Instance**: Review your configuration and click "Launch instance".

---

## Step 3: Connect to Your EC2 Instance

1.  From the EC2 dashboard, find and copy your instance's **Public IPv4 address**.
2.  Open your terminal (or PuTTY).
3.  **For macOS, Linux, or WSL users**, you must first set the correct permissions for your key file to make it not publicly viewable.
    ```bash
    chmod 400 /path/to/your-key.pem
    ```
4.  Connect to the instance using SSH. Replace the file path and IP address with your own.
    ```bash
    ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-ip
    ```
    *(Note: If you chose Amazon Linux AMI, the username is `ec2-user` instead of `ubuntu`.)*

---

## Step 4: Set Up the Server Environment

Once connected to your EC2 instance via SSH, you need to install the necessary software.

1.  **Update System Packages**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```
2.  **Install Node.js**: We'll use `nvm` (Node Version Manager) to easily manage Node.js versions.
    ```bash
    # Download and run the nvm installation script
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

    # Activate nvm for the current session
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    # Install a recent LTS version of Node.js
    nvm install --lts
    ```
    *Verify the installation by running `node -v`.*

3.  **Install Nginx**: Nginx will act as a reverse proxy, directing web traffic from port 80 to your Next.js app (which will run on port 3000).
    ```bash
    sudo apt install nginx -y
    ```
4.  **Install PM2**: PM2 is a process manager for Node.js applications. It will keep your Next.js app running in the background and restart it automatically if it crashes or the server reboots.
    ```bash
    sudo npm install pm2 -g
    ```

---

## Step 5: Deploy Your Code

The recommended way to get your code onto the EC2 instance is by using Git.

1.  **Push to a Git Repository**: Ensure your project is pushed to a service like GitHub, GitLab, or Bitbucket.
2.  **Install Git on EC2**:
    ```bash
    sudo apt install git -y
    ```
3.  **Clone Your Repository**: Clone your project into the home directory.
    ```bash
    git clone https://github.com/your-username/your-repo.git
    ```
4.  **Install Dependencies**: Navigate into your project directory and install the required packages.
    ```bash
    cd your-repo
    npm install
    ```

---

## Step 6: Configure Nginx as a Reverse Proxy

1.  **Create an Nginx Configuration File**: Open the default Nginx configuration file for editing.
    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```
2.  **Configure the Server Block**: Delete the existing content and replace it with the following. This tells Nginx to listen for traffic on port 80 and forward it to your Next.js app running on `localhost:3000`.

    ```nginx
    server {
        listen 80;
        server_name your_ec2_public_ip; # Or your domain name if you have one

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
3.  **Save and Exit**: Press `Ctrl+X`, then `Y`, then `Enter`.
4.  **Test and Restart Nginx**:
    ```bash
    # Test the configuration for syntax errors
    sudo nginx -t

    # Restart Nginx to apply the changes
    sudo systemctl restart nginx
    ```

---

## Step 7: Run Your Application with PM2

From within your project directory on the EC2 instance (`~/your-repo`), start your application using PM2.

1.  **Start the App**: This command executes the `npm start` script (which runs `next start`), names the process `next-app`, and keeps it running.
    ```bash
    pm2 start npm --name "next-app" -- start
    ```
2.  **Save the Process List**: This command creates a startup script, ensuring PM2 will automatically restart your app after a server reboot.
    ```bash
    pm2 save
    ```
3.  **Check Status**: You can view the status and logs of your running application with:
    ```bash
    pm2 list
    # or for logs
    pm2 logs next-app
    ```

---

## Step 8: Access Your Application

You're all set! Open your web browser and navigate to your EC2 instance's public IP address.

`http://your-ec2-public-ip`

You should now see your live Next.js application.

---

## Next Steps

*   **Custom Domain**: Use **AWS Route 53** to point a custom domain to your EC2 instance's IP address.
*   **Enable HTTPS**: Use **Certbot** with Nginx to get a free SSL certificate from Let's Encrypt and enable secure HTTPS traffic.
*   **CI/CD Pipeline**: Set up a **GitHub Actions** workflow to automate the deployment process whenever you push changes to your repository.