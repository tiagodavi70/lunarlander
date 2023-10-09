# Lunar Lander Dashboard

!["Dashboard for Lunar Lander Agent Visualization"](./dashboard.jpg)

[Demo video on YouTube](https://youtu.be/ZPL_KyHYTnk)

The aplication is a simple web server, it serves pages that load data from a CSV file.

For local instances, you have to download the [RLLunarLanding2023.3 dataset](https://uapt33090-my.sharepoint.com/:f:/g/personal/tiagodavi70_ua_pt/EnQ2j9__CvRMqzTXv_GpLYUBkJXF9PhR9QTPvn1aDrLh_A?e=r9JgPO) to the `data` folder.

## 
* Start preprocess environment (only for test and debug with raw files that are not in this repo)
```
conda activate lunarlandervis
jupyter lab --allow-root
```

* Break the file in small pieces to nice git pushes and Github Pages.  
```
```

* Update chart-components  
```
git submodule foreach git pull origin main
```