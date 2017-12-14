---
layout: post
title: Here comes the sun
subtitle: Communicating with a panel which tracks the sun
tags: code
author: pjl
banner: solar_tracker.jpg
banner_alt: The solar tracker in its natural environment
---

A few years back a family friend, Guy, asked for some help setting up the software on his home-made solar panel setup. He wanted an accessible way to edit certain necessary parameters (latitude/longitude, angle to return to at night etc.), so I threw together this Windows app. 

![image](/images/solar_tracker_login.jpg){: .image .post_image}

These parameters were hidden in some big incomprehensible XML file, which one needs to access via FTP. My app was built in C#/.NET using the WPF (Windows Presentation Foundation) framework. It connects with Google Maps to easily set the lat./long. by using their magic search. 

![image](/images/solar_tracker_map.jpg){: .image .post_image}

I'm quite impressed how the entire system has been running for nearly 5 years now (the app only came to mind recently as the Google Maps API I used was being deprecated, so I just fixed this); these panels which track the sun are significantly more effective than the fixed panel design.