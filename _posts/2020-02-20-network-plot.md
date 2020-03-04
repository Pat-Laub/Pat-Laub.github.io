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
       Recently I pulled together a plot to show the collaborations of the researchers in our lab here in Lyon. The plot shows each researcher as a node in the network, and edges are added to signify joint research papers between the (permanent) staff of the lab. The interactive version of the plot is below.
---

Recently I pulled together a plot to show the collaborations of the researchers in our lab here in Lyon. The plot shows each researcher as a node in the network, and edges are added to signify joint research papers between the (permanent) staff of the lab.

It was quite gratifying to see it used in a real-world scenario (an external evaluation of the lab).

![image]({% link  /images/network-plot-in-meeting.jpg %}){: .image .post_image}

The interactive version of the plot is below. Try dragging someone's circle around (click and hold the inner circle) and watch the physics animation redraw the positions of the entire network. Hover over a person see their name, or hover over an edge to see the number of joint papers.

{% include network_plot.html %}

<br><br>
This drawing is done with the vis.js Javascript library.