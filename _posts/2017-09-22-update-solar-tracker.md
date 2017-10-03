---
layout: post
title: Here comes the sun
subtitle: Communicating with a panel which tracks the sun
categories: code
tags: code
author: pjl
banner: solar_tracker.jpg
banner_alt: The solar tracker in its natural environment
---

A few years back a family friend, Guy, asked for some help setting up the software on his home-made solar panel setup. He'd convinced some company to just _give_ him some supremely accurate tracking software for free (I'm still amazed by this), and wanted an accessible way to edit certain necessary parameters (latitude/longitude, angle to return to at night etc.). So I threw together this app. 

![image](/images/solar_tracker_login.jpg){: .image .post_image}

The parameters are in some incomprehensible XML file, which are received/set via FTP. My app was built in C#/.NET using the WPF (Windows Presentation Foundation) framework. It connects with Google Maps to easily set the lat./long. by using their magic search. That's about all the acronyms I can string together over this ha.

![image](/images/solar_tracker_map.jpg){: .image .post_image}
