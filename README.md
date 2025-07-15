# My Web App

This project is a full-stack web application built with React for the client-side and Node.js with Express for the server-side. **Successfully deployed on AWS Elastic Beanstalk with Application Load Balancer.**

🌐 **Live Demo**: [my-web-app-final.eba-wh2vvdxj.eu-central-1.elasticbeanstalk.com](http://my-web-app-final.eba-wh2vvdxj.eu-central-1.elasticbeanstalk.com)

## Project Structure

```
my-web-app
├── client/                 # Client-side React application
│   ├── src/               # React source files
│   ├── build/             # Production build (generated)
│   ├── package.json       # Client dependencies
│   └── README.md          # Client documentation
├── server/                # Legacy server files (not used in production)
├── .elasticbeanstalk/     # AWS EB configuration
├── app.js                 # Main application file for AWS EB
├── package.json           # Main project dependencies
├── Procfile               # Process definition for AWS EB
└── README.md              # Project documentation
```

## 🚀 AWS Elastic Beanstalk Deployment

### ✅ Current Deployment Status:

- **Environment**: `my-web-app-final`
- **Platform**: Node.js 20 running on 64bit Amazon Linux 2023
- **Status**: 🟢 Ready (Health: Green)
- **Load Balancer**: Application Load Balancer ✅
- **Auto Scaling**: Enabled ✅
- **URL**: [my-web-app-final.eba-wh2vvdxj.eu-central-1.elasticbeanstalk.com](http://my-web-app-final.eba-wh2vvdxj.eu-central-1.elasticbeanstalk.com)

### Prerequisites

1. **AWS Account**: Active AWS account with billing enabled
2. **AWS CLI**: Install and configure with your credentials
   ```bash
   aws configure
   ```
3. **EB CLI**: Install Elastic Beanstalk CLI
   ```bash
   pip install awsebcli
   ```

### Quick Deployment Steps

1. **Clone and setup**:

   ```bash
   git clone <repository-url>
   cd my-web-app
   npm install
   ```

2. **Build client application**:

   ```bash
   npm run build
   ```

3. **Deploy to AWS** (already configured):

   ```bash
   eb deploy
   ```

4. **Open application**:
   ```bash
   eb open
   ```

### Deployment Commands

```bash
# Check status
eb status

# View logs
eb logs

# Check health
eb health

# Deploy updates
eb deploy

# Open in browser
eb open

# Scale application
eb scale 2

# View events
eb events
```

### Creating New Environment (if needed)

```bash
# Initialize (already done)
eb init

# Create new environment
eb create my-web-app-new --platform node.js-20

# Deploy
eb deploy
```

## 🛠️ Local Development

1. **Install all dependencies**:

   ```bash
   npm install
   ```

2. **Build React app**:

   ```bash
   npm run build
   ```

3. **Start local server**:

   ```bash
   npm start
   ```

   Server will run on `http://localhost:3001`

4. **Development mode** (separate terminals):

   ```bash
   # Terminal 1 - React development server
   cd client && npm start

   # Terminal 2 - Node.js server
   cd server && npm run dev
   ```

## 📋 Environment Variables (Production)

The following environment variables are automatically set by AWS Elastic Beanstalk:

- `PORT=8080` - Server port (set by AWS EB)
- `NODE_ENV=production` - Environment mode
- `NPM_USE_PRODUCTION=false` - Include dev dependencies for build

## 🏗️ Architecture

```
Internet → Application Load Balancer → Auto Scaling Group → EC2 Instances
                                                          ↓
                                                    Node.js App (app.js)
                                                          ↓
                                                   Serves React Build
```

## 📊 Monitoring & Management

### AWS Console:

- **Elastic Beanstalk**: Monitor application health and events
- **CloudWatch**: View logs and metrics
- **EC2**: Manage instances
- **Load Balancer**: Configure traffic distribution

### CLI Monitoring:

```bash
# Real-time health check
eb health --refresh

# View recent events
eb events

# Monitor logs
eb logs --all

# Check configuration
eb config
```

## 🚨 Troubleshooting

### Common Issues:

1. **Build Fails**:

   ```bash
   # Check Node.js version compatibility
   eb logs
   ```

2. **Application Not Responding**:

   ```bash
   # Check health and logs
   eb health
   eb logs
   ```

3. **Deploy Fails**:
   ```bash
   # Check events for detailed error
   eb events
   ```

### Useful Debug Commands:

```bash
# SSH into instance (if enabled)
eb ssh

# Restart application
eb deploy

# View detailed configuration
eb config

# Check platform version
eb platform list
```

## 💰 Cost Estimation

- **Free Tier**: Available for 12 months (t3.micro instance)
- **Estimated Monthly Cost**: ~$15-25 for small applications
- **Load Balancer**: ~$16/month (Application Load Balancer)
- **EC2 Instance**: ~$8-15/month (t3.micro/small)

## 🔒 Security Features

- ✅ **HTTPS Ready**: Configure SSL certificate in AWS Console
- ✅ **Security Groups**: Automatic firewall configuration
- ✅ **IAM Roles**: Secure AWS service access
- ✅ **VPC**: Isolated network environment
- ✅ **Auto Scaling**: Automatic scaling based on traffic

## 📈 Performance Optimization

- ✅ **Application Load Balancer**: Distributes traffic efficiently
- ✅ **Auto Scaling**: Handles traffic spikes automatically
- ✅ **CloudWatch Monitoring**: Tracks performance metrics
- ✅ **Static File Serving**: Optimized for React build files

## 🎯 Next Steps

1. **Custom Domain**: Configure Route 53 for custom domain
2. **HTTPS**: Add SSL certificate via AWS Certificate Manager
3. **Environment Variables**: Add custom config via EB Console
4. **Database**: Connect RDS database if needed
5. **CDN**: Add CloudFront for global content delivery

## 📞 Support

For AWS Elastic Beanstalk issues:

- **AWS Documentation**: [EB Node.js Guide](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.html)
- **EB CLI Reference**: [CLI Commands](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)

---

**🎉 Your application is now successfully running on AWS with enterprise-grade infrastructure!**

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
