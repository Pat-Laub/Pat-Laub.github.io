---
layout: post
title: Research network plot
subtitle: Visualising research collaborations
tags: code
author: pjl
banner: network_plot.png
banner_alt: Visualisation of the collaborations between research staff at Labo'SAF.
custom-javascript-list:
- "/assets/js/vis.js"
- "/assets/js/network_plot.js"
custom-css-list:
- "/assets/css/vis.css"
- "/assets/css/network_plot.css"

excerpt: >
       Recently I made a visualization in Javascript to show the collaborations of the researchers in our lab here in Lyon. The plot shows each researcher as a node in the network, and edges are added to signify joint research papers between the (permanent) staff of the lab. Try dragging a circle around and watch the physics animation redraw the positions of the entire network in the interactive version.
---

Recently I made a visualization in Javascript to show the collaborations of the researchers in our lab here in Lyon. The plot shows each researcher as a node in the network, and edges are added to signify joint research papers between the (permanent) staff of the lab. The inner circles are coloured acccording to the field of research each person specialises in, and the outer circles show their membership in the many different research groups between our lab and external parties. New research groups which are about to start can be selected by the drop-down box.

The __interactive version__ is below. __Try dragging a circle around__ (click and hold the _inner circle_) and watch the physics animation redraw the positions of the entire network (this is much easier with a real mouse than on a phone). Hover over a person see their name, or hover over an edge to see the number of joint papers.

{% include network_plot.html %}

It was quite gratifying to see it used in a real-world scenario (an external evaluation of the lab).

![image]({% link  /images/network-plot-in-meeting.jpg %}){: .image .post_image}

The [vis.js](https://visjs.org/) Javascript library is the main backbone of the code; [this is the javascript]({% link /assets/js/network_plot.js %}) I wrote to use the vis.js library.
