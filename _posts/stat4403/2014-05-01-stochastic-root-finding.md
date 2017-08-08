---
layout: post
title: Stochastic root-finding review
subtitle:
category: stat4403 
tags: [math, monte carlo]
author: pjl
bibliography: 'main.bib'
csl: 'apa.csl'
excerpt: >
    Consider the inventory stocking problem for a submarine mechanic. At the
    outset of any voyage the mechanic must ensure that their stock of spare
    parts is sufficient for the voyage yet the exact demand of each part is
    not known ahead of time. To be rigorous, let’s say there are $k$
    different parts, and the inventory is originally stocked with
    $x \in {\mathbb{N}}^k$ parts. The demand during the voyage arrives as a...
---

Literature Review
=================

Consider the inventory stocking problem for a submarine mechanic. At the
outset of any voyage the mechanic must ensure that their stock of spare
parts is sufficient for the voyage yet the exact demand of each part is
not known ahead of time. To be rigorous, let’s say there are $k$
different parts, and the inventory is originally stocked with
$x \in {\mathbb{N}}^k$ parts. The demand during the voyage arrives as a
general $k$ dimensional queuing network, which could be arbitrarily
complex (e.g it could take into account substitutability of certain
parts). Describe the cumulative demand by time $t$ as $D_t$, a random
vector which takes values in ${\mathbb{N}}^k$. As $D_t$ is analytically
intractable then analysis must rely on simulated estimates of this
distribution. How does one select $x$ so that after a voyage of length
$h$ time units then ${\mathbb{P}}(D_h \leq x) \geq 1 - \alpha$ for some
level of $\alpha \in (0, 1]$? This problem, adapted from
[@pasupathy2011], is an example of a stochastic root-finding problem.

A general stochastic root-finding problem (SRFP) starts with two main
elements: a function which is unknown to the user $g(x)$ which maps
$\Omega \subset {\mathbb{R}}^q \rightarrow {\mathbb{R}}^q$ and an
unbiased sequence of estimators $G(x)$ (i.e.
$\forall x \in \Omega: {\mathbb{E}}[G(x)] = g(x)$). Many questions can
be asked about the roots of $g$, such as: do any roots exist, how many
roots exist, where are all of the roots, what is an approximation for
some or all of the roots, and what is an approximation for a single
root? Some of these questions have been touched on by the literature,
but the bulk of research has gone into answering the final question.
That is to say, a SRFP typically searches for an estimate for the true
root $x^\*$ of $g$ only using $G(x)$.

SRFPs appear in an overwhelming number of fields including physics,
economics, engineering, statistics and many others. Consider that the
deterministic root-finding problem (DRFP), which is a special case of
above where ${\mathrm{Var}}[G(x)] = 0$, can be interpreted as solving a
nonlinear system of equations. The importance and applications of DRFPs
also motivate the study of SRFPs. Many current applications of DRFPs are
actually SRFPs where the randomness has been ignores; e.g. economic
modeling based on some guess of future interest rates.

It is not just the importance of DRFPs that carries over to SRFPs, but
also the deterministic algorithms. The “gold standard” in numerical
deterministic root-finding is Newton’s method (aka the Newton-Raphson
method). This method starts with an initial guess $x_0$ and produces a
sequence of iterates $\{x_1, x_2, \dots\}$ by the recurrence

$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}.$$

 For the multidimensional
case, replace the derivative with the Jacobian $J(x) = {\nabla}f(x)$ to
achieve 

$$x_{n+1} = x_n - J(x_n)^{-1}f(x_n).$$

 With this background, the
class of SRFPs algorithms called ‘Stochastic Approximation’ can be
described.

In [-@robbins1951], [@robbins1951] introduced the iterative algorithm
now described as Robbins-Monro Stochastic Approximation (RM-SA). For $g$
which is one-dimensional, non-decreasing, has a single simple root at
$x^\*$, then the authors proved convergence of the iterates of random
iterates 

$$X_{n+1} = X_n - a_n G(X_n).$$

 for a predetermined
positive-valued sequence of $\{a_n\}$. They listed some regularity
conditions on $g$, $G$ and on $\{a_n\}$ to prove that
$X_n \rightarrow x^\*$ in probability.

Robbins and Monro’s original paper created a surge of research into the
field. The following year [@wolfowitz1952] answered two questions
proposed by the original paper, and then [@kiefer1952] proposed an
extension to RM-SA which incorporated finite-differences to estimate
$g'(x)$. In the following years @kiefer1952’s algorithm received less
attention than the original RM-SA [@ruppert1991]. Now, any stochastic
approximation algorithm using a finite-differences derivative estimate
is classed as a Kiefer-Wolfowitz stochastic approximation (KW-SA).

Significant work has since gone into relaxing the conditions in the
algorithms of [@robbins1951] and [@kiefer1952], and into generalising
their results (both only considered problems in one dimension).
[@blum1954] proved that RM-SA convergence occurred with probability one,
and was the first to prove the same result for the multidimensional
extension in [@blum1954multi].

Unfortunately KW-SA did not extend to high-dimensions gracefully.
Traditionally finite differences approximation of ${\nabla}f(x)$ in $q$
dimensions requires $q+1$ evaluations of the $f$ function. [@spall1987]
introduced a method for approximating the derivative using only two
function evaluations, called Simultaneous Perturbation Stochastic
Approximation (SPSA). The name is (perhaps obviously) derived from the
fact that the method perturbs every direction at the same time, trading
off accuracy for a significantly faster compute time (for large $q$).
See [@spall1998] for a well-written introduction to the field, and
[@spall2000] for a more developed form of SPSA.

One large implementation problem when using these algorithms is to
choose which sequence/s should be supplied to the algorithm. In RM-SA
the user must specify a step-size sequence $a_n$ such that

$$\sum_{i=0}^\infty a_i = \infty, \quad \sum_{i=0}^\infty a_i^2 < \infty.$$

Though the asymptotic results for rate of convergence hold for any
$a_n$, it has been seen that the finite-time performance is hugely
impacted by this selection. [@robbins1951] originally suggested the form
$a_n = 1/n$ which is very similar to the best current rule-of-thumb 62
years later [@pasupathy2011].

[@polyak1992] and [@ruppert1988] independently arrived at a method to
diminish the impact of a poor selection of $a_n$. They suggested larger
step sizes than the typical $a_n = 1/n$ and using
$\bar{X}_n = \sum_{i=0}^n X_i$ - the sample mean of the iterates - as
the estimator of the root. This is shown to have the same optimal
asymptotic rate of convergence as standard RM-SA yet with better
finite-time characteristics [@thehandbook11], and is now very commonly
used in practice [@asmussen2007]. An in-depth look at all stochastic
approximation techniques and results can be found in [@kushner2003],
[@chen2002], and [@spall2005].

Discussions of averaging lead to the major rival of stochastic
approximation algorithms, which is known as the stochastic counterpart
method (SC) or sample average approximation, or the sample-path method).
In its simplest form, the stochastic counterpart the method replaces
$g(x)$ with $\hat{g}(x)$ which is simply defined as the sample mean of
$G(x)$ after $N$ samples, i.e.

$$\hat{g}(x) = \frac{1}{N} \sum_{i=0}^N G(x).$$

 For an $N$ chosen
sufficiently large (relative to ${\mathrm{Var}}[G(x)]$) then the root of
the surrogate problem $\hat{g}(x)$ is a DRFP that can be solved using
the vast array of algorithms in that field (many can be found in
[@wright1999]). There are some major advantages to SC over SA.
[@pasupathy2011] states that SC, when compared to SA, is very
conceptually simple and that it is powerful as the tools developed for
DRFPs can be utilised. In modern times SC is likely to be preferred over
SA as it is easily parallelisable. Also SC allows examination of
non-differentiable functions which would confuse SA methods [@wang2008].

Initial work on the stochastic counterpart method arose from
[@healy1991] looking at a related concept which is retrospective
optimization methodology. This work discussed the notion of optimizing
the performance of a stochastic system – the context given was resource
allocation and queuing problems – over a selection of available
decisions. [@chen1994] then formally applied the methodology to
stochastic root finding, and Schmeiser’s PhD student Pasupathy
generalised the results to multiple dimensions [@pasupathy2005]. Initial
results on convergence were already proved by [@shapiro1991] in the
context of stochastic optimization. The topic is well-explained by many
books, including: [@rubinstein1993], [@spall2005], and
[@thehandbook11].\
[@rubinstein1997] built on the original work on the stochastic
counterpart method and produced a landmark application of the method for
rare-event simulations. A simplified explanation can be found in
[@thehandbook11], which describes how stochastic counterpart is a vital
component of the cross-entropy method.

Modern work on stochastic approximation techniques seeks to automate the
task of parameter selection. [@spall2000] outlines an adaptive extension
to SPSA. Very recently [@broadie2014] outlined a fully adaptive
extension to both RMSA and KWSA which works well in practice, yet has
little founding in rigorous proofs. Another recent application of
stochastic approximation is in evaluating portfolio risk, cf
[@dunkel2010].

To conclude, a completely different approach to solving SRFPs called the
probabilistic bisection method by [@waeber2011] will be described.
Instead of iterating a single point $X_n$ towards $x^\*$ in some form of
descent method (which is basically all that SA and SC achieve), this
approach iterates a sequences of probability distribution functions
$f_n$ which hopefully converge to the pdf of the constant $x^\*$. When
viewed as a Bayesian approach then $f_0$ is the prior for the location
of the root (typically constant over the considered range), and
successive iterations add information from querying $G(x)$. Each
iteration selects a point
$X_n = {\mathrm{Median}}(f_n(x)) = F_n^{-1}(1/2)$ and queries the sign
of this point 

$$Z_n(X_n) = {\mathrm{sgn}}(G(X_n)).$$

 In this stylised
problem the authors considered the case where

$$p(x) = {\mathbb{P}}({\mathrm{sgn}}(G(x)) = {\mathrm{sgn}}(g(x)))$$

 is
known to the user. The values of $Z_n$ and $p(x)$ describes how to
update the next posterior, i.e. if $Z_n = +1$ then 

$$f_{n+1}(x) =
  \begin{cases}
  2p(x) f_n(x), & \text{if }x > X_n \\
  2(1-p(x)) f_n(x), & \text{if }x \leq X_n
  \end{cases}$$

 else $Z_n = -1$ and 

$$f_{n+1}(x) =
  \begin{cases}
  2(1-p(x)) f_n(x), & \text{if }x > X_n \\
  2p(x) f_n(x), & \text{if }x \leq X_n.
  \end{cases}$$

 For this highly stylised problem and some conditions on
$p$, $g$, $g'(x)$ and ${\mathrm{Var}}[G(x)]$ the authors proved a.s.
convergence of $F_n(x)$ to ${\boldsymbol{1}}(x \geq x^\*)$. This approach
appears to have much potential when competing against the existing
methods; as SA & SC form Markov chains then all the work involved
calculating $G(X_n)$ is thrown away after each step, whereas the
Bayesian approach incorporates all previous queries of $G$ into
$f_n$.[^1]

Main Theorems
=============

*Proof of Robbins-Monro convergence almost surely:*

Results listed below are adapted from the original proof by [@blum1954].

Say $g(x)$ is a Lebesgue measurable function and our available estimator
$G(x)$ is unbiased (i.e. ${\mathbb{E}}[G(x)] = g(x)$) and that
$\{a_n : n \in {\mathbb{N}}\}$ is the user-supplied step sequence. The
following conditions must be satisfied:

$$\textstyle \sum_{n=1}^\infty a_n = \infty \tag{A}\label{A}$$

$$\textstyle \sum_{n=1}^\infty a_n^2 < \infty \tag{B}\label{B}$$

$$|g(x)| \leq c + d|x| \tag{C}\label{C}$$

$${\mathrm{Var}}[G(x)] \leq \sigma^2 < \infty \tag{D}\label{D}$$

$$g(x) < 0 \text{ for } x < \theta, \quad g(x) > 0 \text{ for } x > \theta \tag{E}\label{E}$$

$$\inf_{\delta_1 \leq |x-\theta| \leq \delta_2} |g(x)| > 0 \text{ for every pair } 0 < \delta_1 < \delta_2 < \infty \tag{F}\label{F}$$

The assumptions are as follows: $\eqref{B}$ sets a minimum decrease rate
of the step sequence, $\eqref{C}$ ensures the function isn’t too steep
for root-finding, $\eqref{D}$ ensures the noise in our measurements is
finite, $\eqref{E}$ states that there is at most one root and
$\eqref{F}$ “ensures that the iterates do not accumulate at any finite
point” [@pasupathy2011].

\[lemma:sum\] If $\eqref{B}$ and $\eqref{D}$ hold then the sequence
$\{ X_{n+1} + \sum_{j=1}^n a_j g(X_j) \}$ converges to a random variable
with probability one.

[@blum1954] cites Lemma \[lemma:sum\] as a minor extension of Lemma 5.2
in [@loeve1951].

\[lemma:wp1\] If $\eqref{B}$, $\eqref{C}$, $\eqref{D}$ and $\eqref{E}$
hold then $X_n$ converges w.p.1.

First want to show

$${\mathbb{P}}\left(\lim_{n\rightarrow \infty} X_n = \pm \infty\right) = 0.\label{conv:fin}$$

Suppose $\{X_n \}$ is a sample sequence which diverges to $+\infty$ (a
similar argument holds for $-\infty$). This means $X_n \leq \theta$ for
only finitely many $n$, so $\eqref{E}$ $\Rightarrow a_ng(X_n) > 0$ for
large enough $n$. Then in the limit

$$\lim_{n\rightarrow \infty} X_{n+1} + \sum_{j=1}^n a_jg(X_j) =+\infty$$

whereas Lemma \[lemma:sum\] states this limit converges with probability
one. Therefore the limit diverges with probability zero and we have
shown $\eqref{conv:fin}$ to be true.

Assume the statement of the lemma is false and it will be proved by
contradiction. Lemma \[lemma:sum\] and $\eqref{conv:fin}$ imply that
there exist sample sequences with positive probability such that

$$\label{contr1}
  X_{n+1} + \sum_{j=1}^n a_jg(X_j) \text{ converges to a finite number.}$$

and the assumption of the lemma being false implies 

$$\label{contr2}
  \lim \inf X_n < \lim \sup X_n.$$

 Select such a sequence of $X_n$ and
w.l.o.g assume $\lim \sup X_n > \theta$. We can select numbers $a$ and
$b$ such that

$$a > \theta, \quad \lim \inf X_n < a < b < \lim \sup X_n$$

 Now for $N$
large enough then $N \leq n < m$ means 

$$\label{an_bounds}
  a_n \leq \min \left\{ \frac{1}{3d}, \frac{b-a}{3(c + d|\theta|)} \right\}$$

which is fine since $\eqref{B}$ implies $a_n \rightarrow 0$, and also

$$\label{bound}
  \left| X_m - X_n + \sum_{j=n}^{m-1} a_j g(X_j) \right| \leq \frac{b-a}{3}$$

which is justified by $\eqref{contr1}$. Fix values for $m$ and $n$ so
that

$$\label{summands}
  N \leq n < m, \quad X_n < a, \quad X_m > b, \quad n < j < m \Rightarrow a \leq X_j \leq b.$$

In particular note that for $n<j<m$ then $\eqref{summands}$ &
$\eqref{E}$ means that $a_jg(X_j) > 0$. By rearranging $\eqref{bound}$
and applying this note we can see that 

$$\label{ineq}
  X_m - X_n \leq \frac{b-a}{3} - \sum_{j=n}^{m-1} a_jg(X_j) 
        \leq \frac{b-a}{3} - a_ng(X_n)$$

 To finish the proof we take
cases. If $\theta < X_n$ then $g(X_n) > 0$ so $\eqref{ineq}$ states that

$$X_m - X_n \leq \frac{b-a}{3}$$

 but $\eqref{summands}$ implies that
$X_m - X_n > b-a$, so a contradiction! This leaves considering the case
where $X_n \leq \theta$, so $g(X_n) < 0$ and by $\eqref{C}$:

$$\begin{aligned}
 \label{ineq2}
  -g(X_n)  &= |g(X_n)| \notag \\
       &\leq c + d|X_n| \notag \\
       &\leq c + d|\theta| + d|\theta - X_n| \notag \\
       &\leq c + d|\theta| + d(X_m - X_n)\end{aligned}$$

So plugging $\eqref{ineq2}$ into $\eqref{ineq}$ gives 

$$\begin{aligned}
 \label{anothercontr}
  X_m - X_n &\leq \frac{b-a}{3} + a_n(c + d|\theta| + d(X_m - X_n))\\
        &= \frac{b-a}{3} + a_n(c + d|\theta|) + a_n d(X_m - X_n)  \\
        &\leq \frac{b-a}{3} + \left(\frac{b-a}{3(c+d|\theta|)}\right)(c + d|\theta|) + \left(\frac{1}{3d}\right) d(X_m - X_n) \qquad \text{ by $\eqref{an_bounds}$}\\
        &\leq \frac{b-a}{3} + \frac{b-a}{3} + \frac{X_m - X_n}{3}\end{aligned}$$

Collecting $X_m - X_n$ terms together and multiplying by $\frac{3}{2}$
gives 

$$(X_m-X_n) \leq b-a$$

 which again contradicts $X_m - X_n > b-a$
from $\eqref{summands}$! Therefore all cases lead to a contradiction so
the lemma is proved.

If conditions $\eqref{A}$-$\eqref{F}$ hold then the Robbins-Monro
iterates $X_n$ converge to the root $\theta$ w.p.1.

We have from Lemma \[lemma:wp1\] that

$${\mathbb{P}}\left(\lim_{n\rightarrow\infty} X_n = X\right) = 1$$

 for
some $X$. Again seek a contradiction by assuming that

$${\mathbb{P}}\left(X \not= \theta\right) > 0.$$

 Choose some
$\epsilon_1, \epsilon_2$ s.t.
$\theta < \epsilon_1 < \epsilon_2 < \infty$[^2] and 

$$\label{epsilon}
  {\mathbb{P}}(\epsilon_1 < X < \epsilon_2) > 0$$

 Consider all the
sequences $X_n$ that, for a chosen $(\epsilon_1, \epsilon_2)$, satisfy
$\eqref{epsilon}$. For $n$ large enough then

$$\epsilon_1 \leq X_n \leq \epsilon_2.$$

 The set of all such sequences
has positive probability. Lemma \[lemma:sum\] states that

$$X_{n+1} + \sum_{j=1}^n a_j g(X_j) \text{ converges w.p.1}.$$

 Yet
consider applying $\eqref{F}$ so that 

$$g(X_n) > 0$$

 eventually and as
$\eqref{A}$ states the $a_n$ also diverge so overall this sum would
diverge almost surely. This is contradiction!

See [@kushner2003] for many more proofs on convergence guarantees and
convergence speed of stochastic approximation algorithms.

Algorithms
==========

Pseudocode
----------

$n \gets 0$ $a_n \gets a/(n+1)^{0.5}$
$X_{n+1} = \Pi_{\Omega}(X_n-a_n G(X_n))$ $n \gets n+1$

$n \gets 0$ $a_n \gets a/(n+1)^{0.5}$ $c_n \gets c/(n+1)^\gamma$
$U_n \gets (0, 0, \dots)$ $U_n(i) = (G(X_n + c_n) - G(X_n - c_n))/2c_n$
$X_{n+1} = \Pi_{\Omega}(X_n-a_n U_n^{-1} G(X_n))$ $n \gets n+1$
$X_t = \Pi_{\Omega}(-a_t G(X_{t-1}))$ $t \gets t+1$

The probabilistic bisection algorithm was sufficiently described in the
text of the literature review.

MATLAB Implementation
---------------------

    function Xs = sa(G, x0, rm, N, a, alpha, n0, c, gamma, tol, maxIters)
      % Cannot have empty G or x0 arguments
      if isempty(G) || isempty(x0)
        error('Must have a valid input G(x) function and x0 start pos.');
      end
      
      % Number of dimensions in the domain
      q = numel(x0);
      
      % Default to Robbins-Monro algorithm
      if isempty(rm)
        rm = true;
      end
      % Default value for N
      if isempty(N)
        N = 1;
      end
      % Default value for a
      if isempty(a)
        if rm
          a = 0.3; % in [0.1, 0.5]
        else
          a = 1.5; % 1.5 or 2
        end
      end
      % Default value for alpha
      if isempty(alpha) && rm
        alpha = 0.5; % 0.5 or 0.6
      end
      % Default value for n0
      if isempty(n0)
        if rm
          n0 = 10; % 5-10% of total number of iterations
        else
          n0 = 1;
        end
      end
      % Default value for c
      if isempty(c) && ~rm
        c = 0.5;
      end
      % Default value for gamma
      if isempty(gamma) && ~rm
        gamma = 0.25;
      end
      % Default value for tolerance
      if isempty(tol)
        tol = 1e-3;
      end
      % Default value for max iterations
      if isempty(maxIters)
        maxIters = 1e4;
      end
      
      % Setup sample average function
      GN = @(x) (1/N)*sum(G(repmat(x, N, 1)), 1);
      
      % Setup the history of the iterates
      % (note: X is row vector, so X_i is in Xs(i,:))
      Xs = zeros(maxIters,q);
      Xs(1,:) = x0;
      X = x0;
      
      % Iterate until either give up or iterates converge
      for n = 2:maxIters
        % Setup the real-valued sequences
        if rm
           an = a/(n+n0)^alpha;
        else
           an = a/(n+n0);
           cn = c/n^gamma;
       
           % Approximate the derivative using finite differences
           J = zeros(1, q);
           for i=1:q
             e = zeros(1, q);
             e(i) = 1;
             J(i,:) = (GN(X+cn*e)-GN(X-cn*e))/(2*cn);
           end
        end
        
        GX = GN(X);
        
        if rm
          X = X - an*GX;
        else
          X = X - (an*GX / J);
        end
        
        % Update history
        Xs(n,:) = X;
       
        % Check for convergence of iterates (to a specified tolerance)
        if hypot(Xs(n-1,:), Xs(n,:)) < tol
          display('Converged!');
          Xs = Xs(1:n);
          break;
        end
        
        % Check for convergence in function space
        if abs(GX) < tol
          display('Function close to zero!');
          Xs = Xs(1:n);
          break;
        end
      end
    end

    function x = prob_bisection(N)
        p = 0.6;
        q = 1-p;
        % start with g(x) = step function around 1/2
        g = @(xn) 0.2532 .* (-1).^(xn >= 1/2);
        
        % noise Y is normal(0, 0.05^2)
        Y = @(xn) g(xn) + 0.05*randn();
        
        syms t clear;
        syms t;
        
        f = symfun(heaviside(t), t);
        x = 1/2;
        
        for iter=2:N
            ezplot(f, [0, 1]);
            title(sprintf('Posterior after %d steps', iter-1));
            drawnow;
            
            % Check the sign of this point
            Z = (Y(x) > 0);

            % Update posterior
            if Z == 1            
               f = f - (1-2*q)*heaviside(t) + 2*(2*p-1)*heaviside(t-x);
            else
               f = f - (1-2*p)*heaviside(t) + 2*(2*q-1)*heaviside(t-x);
            end
            
            % Pick next point
            Finv = finverse(int(f));
            x = Finv(1/2);
        end
    end

Note that Listing \[lst:bisect\] is a terribly inefficient
implementation of the algorithm. It performs symbolic integration and
symbolic inversion which crash MATLAB once the function grows (after
roughly 10-15 iterations). Since the pdf is a level function then some
of the tasks should be simple to do manually, an attempt at this type of
solution is attached in the appendix (Section \[app:bisect\]).

Worked Examples and Realisations
================================

The main point to illuminate here is how difficult it is to actually
find problems to apply stochastic approximation to. For example

$$g(x) = x^2, \text{or}$$

 

$$g(x,y) = (x^2, y^2)$$

 both fail the
condition that the roots are not simple (i.e. quadratic at the root).

$$g(x,y) = x^2 y^2$$

 would require special attention before SA could run
as $g: {\mathbb{R}}^2 \rightarrow {\mathbb{R}}^1$ and not
${\mathbb{R}}^q \rightarrow {\mathbb{R}}^q$. 

$$g(x, y) = (x+2y, 0)$$

 has
infinitely many roots and so would not converge to a single root. Even
the general case where $c\in{\mathbb{R}}$ and 

$$g(x, y) = (xy, c)$$

would cause trouble within the Kiefer-Wolfowitz framework as the second
partial derivative is zero. Many of the test functions for deterministic
optimization generate many local minima in an attempt to confuse any
global optimisation solver. Functions with local minima typically do
quite confuse stochastic approximation solvers.

A simple test in one dimension is

$$g(x) = x, \quad G(x) \sim N(x, \sigma^2)$$

This error for this test, using a few values for $\sigma^2$, can be seen
in Figure \[fig:simpleRM\] for $x_0 = 100$ (MATLAB to generate this
result in Listing \[lst:simple\_test\]).

    g = @(x) x; Xs = [];

    for sigma = [1, 10, 100, 1000];
      G = @(x) g(x) + sigma*randn(size(x));
      x0 = 100;
      X = sa(G, x0, true, 1, [], [], [], [], [], [], []);
      Xs = [Xs , X];
    end
      
    plot(Xs);
    title('G(x) \sim N(x, \sigma^2)'); ylabel('Error'); xlabel('Iteration Number');
    legend('\sigma = 1', '\sigma = 10', '\sigma = 100', '\sigma = 1000');

Figure \[fig:simpleRMvsKW\] compares how KWSA performs relative to RMSA
on this problem for $\sigma^2=1, x_0 = 100$.

Notice that KWSA performs horribly on this problem with the default
recommended parameters. The problem is that since the noise is
relatively large compared to the change in $g(x)$ then for a small
finite difference interval $c_n = c / n^\gamma$ then the derivative will
be estimated poorly. One can fix this by adjusting $c$ from 0.5 to 50,
and the Figure \[fig:simpleRMvsKWfixed\] shows the improvement. Both
Figure \[fig:simpleRMvsKW\] and Figure \[fig:simpleRMvsKWfixed\] were
generated by Listing \[lst:RMSAvsKWSA\].

    figure; hold on;
    g = @(x) x; 
    G = @(x) g(x) + randn(size(x));
    x0 = 100;

    % Show RMSA vs KWSA with default c value
    for i = 1:5
      XRM = sa(G, x0, true, 1, [], [], [], [], [], [], []);
      XKW = sa(G, x0, false, 1, [], [], [], 0.5, [], [], []);
      plot(abs([XRM, XKW]));
    end
    xlabel('Iteration Number'); ylabel('Error');
    title('RMSA vs KWSA (c = 0.5)'); legend('RMSA', 'KWSA');

    % Show RMSA vs KWSA with larger c value
    figure; hold on;
    for i = 1:5
      XRM = sa(G, x0, true, 1, [], [], [], [], [], [], []);
      XKW = sa(G, x0, false, 1, [], [], [], 50, [], [], []);
      plot(abs([XRM, XKW]));
    end
    xlabel('Iteration Number'); ylabel('Error');
    title('RMSA vs KWSA (c = 50)'); legend('RMSA', 'KWSA');

The other way that the KWSA could be adjusted to better compete against
the RMSA is to add in an element of stochastic counterpart. I.e. select
some $N$ and then, in the algorithm for KWSA, replace any evaluation of
the random function $G(x)$ with 

$$\label{adding-sc}
  G_N(x) = \frac{1}{N} \sum_{i=1}^N G(x).$$

 This would reduce how
sensitive the derivative estimation is for large-noise environments.

Stochastic counterpart though does not handle too well in extreme
variability, especially when considering the extra compute-time it
entails. Figure \[fig:sc\] shows how RMSA with added SC (i.e. in the
same manner as $\eqref{adding-sc}$) for $G(x) \sim N(x, 500^2)$ and
$x_0 = 100$; MATLAB for this result can be seen in Listing \[lst:sc\].

    g = @(x) x; 
    G = @(x) g(x) + 500*randn(size(x));
    x0 = 100;

    Xs = [];
    for N = [1, 2, 5, 10]
      X = sa(G, x0, true, N, [], [], [], [], [], [], 1e5);
      Xs = [Xs, X];
    end
    plot(abs(Xs));

    title('Stochastic Counterpart (on RMSA)');
    xlabel('Iteration Number'); ylabel('Error');
    legend('N=1', 'N=2', 'N=5', 'N=10');

It is interesting to test RMSA against a function for which it should
really fail on. One such function is Rastrigin’s function, $r(x)$; the
two-dimensional version is plotted in Figure \[fig:rastrigin\].

$$r(x) = 10n + \sum_{i=1}^n (x_i^2 - 10\cos(2\pi x_i))$$

The first problem with applying SA is that, again, the function maps two
arguments to one function value, so a dummy second value must be added.
For example, one could consider

$$g(x) = (r(x), x_1), \quad g(x) = (r(x), x_1 + x_2), \quad g(x) = (r(x), x_1 x_2).$$

As it turns out, the choice makes little impact on the result of RMSA.
Each option breaks the attached implementation after about 10 iterations
(it returns NaN), though some results can be extracted if the algorithm
is capped at a tiny number of iterations. For RMSA capped at five
iterations and 

$$G(x) \sim N((r(x), x_1), 5^2)$$

 using a grid of
$[-2, 2]^2$ for $x_0$, then the resulting error can be seen in Figure
\[fig:rast-results\][^3].

Note this plot shows the error of the final iterate (i.e. Euclidean norm
of the iterate as the zero is at the origin) for each starting position.
Twenty experiments were run for each starting location and the error
plotted is the average over these trials. MATLAB code is shown in
Listing \[lst:rast-results\].

    g = @(x) [20+sum(x .^ 2 - 10*cos(2*pi*x), 2), x(:,1)];
    G = @(x) g(x) + 5*randn(size(x));
    N = 20; Xs = linspace(-2, 2, 100); Ys = linspace(-2, 2, 100);
    errors = zeros(numel(Xs), numel(Ys));

    for i=1:numel(Xs)
      for j=1:numel(Ys)
        X0 = [Xs(i), Ys(j)]
        err = 0;
        for rep=1:N
          X = sa(G, X0, true, 1, [], [], [], [], [], [], 5);           
          err = err + hypot(X(end,1), X(end,2));
        end
        errors(i,j) = err/N;
      end
    end

    imagesc(Xs, Ys, errors);
    colorbar;

An illuminating graphic is to see where the iterates move on the way to
the root. Returning to a simple function, 

$$g(x) = (x_1, x_2)$$

 then the
location of the iterates can be seen in Figure \[fig:iterates\]. The
MATLAB to generate this figure is in Listing \[lst:iterates\].

    g = @(x) [x(:,1), x(:,2)]; 
    G = @(x) g(x) + randn(size(x));
    x0 = [1, 1];

    XRM = sa(G, x0, true, 4, [], [], [], [], [], [], 1e3);
    XKW = sa(G, x0, false, 4, [], [], [], [], [], [], 1e3);

    figure; hold on;
    quiver(XRM(1:(end-1),1), XRM(1:(end-1),2), diff(XRM(:,1)), diff(XRM(:,2)), 0);
    quiver(XKW(1:(end-1),1), XKW(1:(end-1),2), diff(XKW(:,1)), diff(XKW(:,2)), 0);

    a = axis();
    a = [min(a(1),a(3)), max(a(2),a(4)), min(a(1),a(3)), max(a(2),a(4))];
    ezcontour('sqrt(x^2+y^2)', a);

    legend('RMSA', 'KWSA'); title('g(x,y) = (x, y)');

Consider a real SRFP (not simply a deterministic function plus noise)
which is the task of planning a telephone network to achieve some grade
of service. To use the typical notation used in fixed-route loss network
theory [@kelly1991], take: the network to have $J$ links, set of routes
$\mathcal{R}$, Poisson rate of offered traffic $\boldsymbol{\nu}$ (a
vector of length $|\mathcal{R}|$), a call requirements matrix $A$ (of
size $J \times |\mathcal{R}|$, assume a 0-1 matrix) and capacity
constraints (number of circuits) vector ${\boldsymbol{C}}$ (of length
$J$).

A reversible Markov Chain can be formed by considering a state
${\boldsymbol{n}}= (n_r, r \in \mathcal{R})$ to be the vector counting
how many calls are in progress along a route inside $\mathcal{R}$. The
state space
$S = \{ {\boldsymbol{n}}\in \mathbb{Z}_+^{|\mathcal{R}|}  : A{\boldsymbol{n}}\leq \boldsymbol{C}\}$
forms a polytope. In particular denote a state ${\boldsymbol{n}}$ to be
blocking for route $r$ if
${\boldsymbol{n}}+ \boldsymbol{e}_r \not\in S$.

Of particular interest is calculating the probability of a call along a
certain route once the Markov Chain has reached its stationary
distribution. Denote the probability of a connection being lost to be
$L_r$ and the probability of a link being full as $B_j$.

When some simplifying assumptions on the model are made, then analytical
solutions for $L_r$ and $B_j$ exist. The standard assumptions are to
take: arrivals to be independent time-homogeneous Poisson processes,
call lengths to be iid exponential (w.l.o.g with mean 1) and that calls
made on a blocked route are discarded and do not queue. In an actual
telecommunication system there are far more complicating factors,
including: time-inhomogeneity, alternative routing, trunk reservation
and packet-switched networks.

For the simple loss network described the stationary distribution is

$$\pi({\boldsymbol{n}}) = G({\boldsymbol{C}})^{-1} \prod_{r \in \mathcal{R}} \frac{\nu_r^{n_r}}{n_r!}$$

$$G({\boldsymbol{C}}) = \sum_{ {\boldsymbol{n}}\in S({\boldsymbol{C}})} \prod_{r \in \mathcal{R}} \frac{\nu_r^{n_r}}{n_r!}.$$

With $\pi({\boldsymbol{n}})$ one can simply add up stationary
probability for any state which is utilising $C_j$ links to get the link
loss probabilities $B_j$. Then the route loss probabilities can be found
by 

$$L_r = 1 - \prod_{j \in r} (1 - B_j).$$

 While this is helpful, it
doesn’t give a practical solution to finding $L_r$ for reasonable-sized
networks as computing $G({\boldsymbol{C}})$ is \#P-complete. Sampling
from $\pi({\boldsymbol{n}})$ is possible though as it is simply the
multidimensional truncate Poisson distribution. Listing
\[lst:samp\_pois\] shows how one could (inefficiently) achieve this by
crude acceptance-rejection.

    function n = sample_poisson(nu, A, C, testEach)
      if size(nu, 1) ~= size(A, 2)
        error('Input arguments are of the wrong size');
      end
      
      skip = 0;
      maxIter = 1e5;
      for iter=1:maxIter
         n = zeros(size(nu, 1), 1);       
         for i=1:numel(nu)
          n(i) = poissrnd(nu(i));
          if testEach && mod(i,2) == 0 && any(A*n > C)
            skip = 1;
            break;
          end    
         end

         if skip == 1
           skip = 0;
           continue;
         end
         
         if all(A*n <= C)
           break
         end
      end

      if iter==maxIter
        error('Acceptance Rejection failed.');
      end
    end

Now the SRFP to solve can be described fully. Fix a network which has a
star structure with 25 links ($J = 25$). The routes $\mathcal{R}$ are
every pair of links, and each route $r$ requires one line on each link.
The capacity ${\boldsymbol{C}}$ is identical for every link, so
$C_i = C_j = C$ is the decision variable in this problem. Specify a
grade of service, $\forall r \in \mathcal{R} : L_r = 0.05$, and find the
root of the equation 

$$Error(C) = |L_r(C) - 0.05|.$$

 One can construct
an estimator for this function by using crude Monte Carlo, see Listing
\[lst:cmc\] and Listing \[lst:bp-cmc\].

    function B = blocking_probability(indivCapacity, N)
      % Parameters
      individArrival = 1;

      if isempty(indivCapacity)
        indivCapacity = 35;
      end
      if isempty(N)
        N = 1e3;
      end

      % Construct a Star Network
      numLinks = 25;
      numRoutes = nchoosek(numLinks, 2);

      A = zeros(numLinks, numRoutes);
      r = 0;
      for i=1:numLinks
        for j=i:numLinks
          if i ~= j
            r = r+1;
            A(i,r) = 1;
            A(j,r) = 1;
          end
        end
      end
      if r ~= numRoutes
        error('Error constructing A matrix');
      end

      % Capacity of the network
      C = indivCapacity .* ones(numLinks, 1);

      % Arrival rates
      nu = individArrival*ones(numRoutes, 1);

      % CMC result
      B = blocking_prob_cmc(nu, A, C, N);
    end

    function blockProb = blocking_prob_cmc(lambda, A, C, numSamples)
      % CMC Estimate of Blocking
      if isempty(numSamples)
        numSamples = 1e5;
      end
      
      blockProb = 0;
      for sample=1:numSamples
        n = sample_poisson(lambda, A, C, false);
        if is_blocking(A, n, C)
          blockProb = blockProb + 1;
        end
      end

      blockProb = blockProb / numSamples;
    end

    function blocking = is_blocking(A, n, C)
      blocking = any(C - A*n == 0);
    end

When the grade of service considered is small then $C$ tends to large
values and blocking becomes a rare event. In this situation then
importance sampling can be applied to the problem to fix CMC reporting
the blocking probabilities to be simply zero. One way is to scale the
mean of the multidimensional truncated Poisson process being sampled
from, such that it is much more likely to be near the blocking states.
Listing \[lst:bp-is\] shows an implementation of this change of measure,
though unfortunately it is intolerably slow as the acceptance-rejection
in Listing \[lst:samp\_pois\] fails almost certainly each time. An
alternative change of measure that appears very applicable is in
[@mandjes1997].

Using the CMC estimator, one can evaluate the loss probability for
various selections of network capacity, see Figure \[fig:block\_prob\].
It appears that $C \in \{30, \dots, 40\}$ is the region which most
closely matches the required grade of service $0.05$.

    function blockProb = blocking_prob_is(nu, m, A, C, numSamples)
      % Importance Sampling Estimate of Blocking
      if isempty(numSamples)
        numSamples = 1e5;
      end
      
      % Change of measure
      if isempty(m)
        newN = floor(min(C)/(size(A,1)-1))
        m = newN / max(nu);

        if m < 1
          display('Using a smaller nu!');
        end
      end
      newNu = m .* nu;
      
      % Likelihood ratio of getting k on link i
      factorials = [1, cumprod(1:max(C))];
      
      const = sum(newNu(1).^(0:C(1)) ./ factorials(1:(C(1)+1))) / ...
        sum(nu(1).^(0:C(1)) ./ factorials(1:(C(1)+1)))
      Wi = @(k, i) (1/m)^k * const;
        
      blockProb = 0;
      
      for sample=1:numSamples
        n = sample_poisson(newNu, A, C, false);
        if is_blocking(A, n, C)
          % Calculate the combined likelihood ratio
          W = 1;
          for r=1:size(A,2)
            for j=1:size(A,1)
              if A(j, r) == 1 %&& n(r) > 0
                W = W * Wi(n(r), j);
              end
            end
          end
            
          blockProb = blockProb + W;
        end
      end

      blockProb = blockProb / numSamples;
    end

Now the test environment is almost ready to apply stochastic
approximation to the CMC estimator in Listing \[lst:cmc\], though
another estimate at the true solution will be stated with which to
compare the experiment results. The true solution is estimated using
Erlang’s Fixed Point Approximation (EFPA).

Assume each link blocks independently of all the other links (which is
obviously not true) and assess the links separately. Erlang’s formula,

$$E(\nu, C) = \frac{\nu^C}{C!} \left[ \sum_{n=0}^C \frac{\nu^n}{n!} \right]^{-1}$$

will give the blocking probability of a single link with capacity $C$
under offered load $\nu$. In the entire network

$$B_j = E(\rho_j, C_j).$$

 where $\rho_j$ is the so called “reduced load”
to this link (i.e. the expected arrival rate from
$R_j \subset \mathcal{R}$ (the routes that use link $j$)). EFPA boils
down to calculating the fixed point of the equation

$$B_j = E(\rho_j, C_j), \quad j \in J$$

$$\rho_j = \sum_{r \in R_j} \nu_r \prod_{i \in r \setminus \{j\} } (1 - B_i), \quad j \in J$$

which can simply be done using fixed point iteration. Figure
\[tab:efpa\] lists the estimates of $L_r$ under the specific SRFP
problem previously described, and indicates that a value of $C = 31$ is
the smallest capacity that achieves the grade of service required. The
Python used to generate this table is attached in the appendix (Section
\[app:efpa\]).

[2]{}

  ------------ ------------- --------------
   *Capacity*   *Loss Prob*     *Error*
     $C_j$         $L_r$      $|L_r-0.05|$
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
  ------------ ------------- --------------

  ------------ ------------- --------------
   *Capacity*   *Loss Prob*     *Error*
     $C_j$         $L_r$      $|L_r-0.05|$
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
                             
  ------------ ------------- --------------

So the RMSA was applied to find the root of the error function

$$\label{err-fn}
  Error(x) = 0.05 - L_r(\lceil x \rceil)).$$

 The ordering of the terms
is intentional as $L_r$ is a non-increasing function and RMSA expects
monotone increasing functions. As $L_r$ swiftly levels off to zero at
$x \geq 50$ then $Error(x)$ is also flat with constant value of $0.05$.

RMSA also expects a problem which has an unconstrained continuous
decision variable, whereas this problem has $x \in {\mathbb{N}}$; to
address these issues the starting position was selected to be a positive
number $x_0 = 100$ (and it was hoped that the solver would not jump too
far into negative territory) and the ceiling function was added in
$\eqref{err-fn}$. Listing \[lst:gen-code\] shows the specific parameters
selected for the test.

Figure \[fig:network\] shows RMSA converging to an optimal value of
$C=38$. This result agrees with prior CMC results shown in Figure
\[fig:block\_prob\] and is similar though larger than the EFP
approximation in Figure \[tab:efpa\]. KWSA could not be applied since if
started where $\nabla L_r(x) \approx 0$ then division by zero errors
occur; also if started too close to the root then it almost always
overshoots (when stumbling over a poor derivative estimate) into
negative values of X or into values so small that the
acceptance-rejection scheme continually rejects samples.

    G = @(x) 0.05 - blocking_probability(ceil(x), 100);
    x0 = 100;
    Xs = sa(G, x0, true, 1, 100, 0.01, [], [], [], [], []);

Appendix: EFPA Source Code {#app:efpa}
==========================

Note: This code was re-used from research the author undertook as part
of an AMSI Summer Vacation Scholarship over 2012/13.

``` {language="python" tabsize="2"}
#!/usr/bin/python3.3
import numpy as np
import math
from sets import Set
import profile

################ Network Configurations ########################

def A_star(J):
  """
  Generate the A matrix for a star network with J links

  A_star(int) -> Jx|R| matrix = Jx(J(J-1)/2) matrix

  """
  routes = []

  for i in range(J):
    for j in range(i, J):
      if i != j:
        col = [0]*J
        col[i] = 1
        col[j] = 1
        routes.append(col)

  return np.matrix(routes).T

############### Erlang Fixed Point Approximation ###############

def E(v, c):
  """
  Erlang's Formula (1.1) for a single link with offered traffic v and c links.

  E(float, int) -> float

  """
  v = float(v)
  c = int(c)
  numer = v**c / math.factorial(c)
  
  denom = 0.
  for n in range(c):
    denom += v**n/math.factorial(n)
  denom += numer 

  return numer/denom

def rho(A, E, V, j):
  """
  Parameter rho_j for use in EFPA.

  rho(Jx|R| matrix, Jx1 matrix, |R|x1 matrix, int) -> float 

  """
  partial_sum = 0.

  # for every route that contains link j
  for r in A[j].nonzero()[1].flat:
    prod = 1

    # for every link in route r
    for i in A[:,r].nonzero()[0].flat:
      if i != j:
        prod *= (1-E[j,0])

    partial_sum += V[r,0]*prod 

  return partial_sum

def fixed_point_iteration(A, C, V):
  """
  Estimate the Erlang Fixed Point by using Fixed Point Iteration. 

  fixed_point_iteration(Jx|R| matrix, Jx1 matrix, |R|x1 matrix, int) -> Jx1 matrix

  """
  # start iteration at the 0 vector
  E_est = np.zeros(C.shape)

  # do at most 1000 rounds of approximating
  for i in range(1000):
    E_next = np.zeros(E_est.shape)

    for j in range(C.shape[0]): 
      rho_j = rho(A, E_est, V, j)
      E_next[j,0] = E(rho_j, C[j,0])

    
    delta = np.absolute(E_next - E_est).max()
    E_est = E_next

    # test for divergence
    if (E_est < 0).any():
      raise RuntimeError("Fixed Point Iteration diverged: E_i became negative")
    if (E_est > 1).any():
      raise RuntimeError("Fixed Point Iteration diverged: E_i became larger than 1")

    # test for convergence
    if delta < 1e-4:  
      break

  return E_est

def success_efpa_r(A, C, V, r):
  """
  Calculate stationary probability for a call on route r to suceed.
  Uses Fixed Point Approximation starting at E_i = 0.

  success_efpa_r(Jx|R| matrix, Jx1 matrix, |R|x1 matrix, int) -> float

  """
  # use E_est to estimate success probabilities
  E_est = fixed_point_iteration(A, C, V)
  result = 1
    
  # for every link in route r
  for j in A[:,r].nonzero()[0].flat:
    result *= (1 - E_est[j,0])

  return result   

def success_efpa(A, C, V):
  """
  Calculate stationary probability for a call on each route to suceed.
  Uses Fixed Point Approximation starting at E_i = 0.

  success_efpa(Jx|R| matrix, Jx1 matrix, |R|x1 matrix) -> |R|x1 matrix

  """
  # use E_est to estimate success probabilities
  E_est = fixed_point_iteration(A, C, V)
  result = np.zeros(V.shape)
  
  for r in range(V.shape[0]):
    result[r,0] = 1
    
    # for every link in route r
    for j in A[:,r].nonzero()[0].flat:
      result[r,0] *= (1 - E_est[j,0])
  
  return result   

###################### Sampling Methods ########################

import sys

def get_sample_reject(A, C, V):
  """
  Sample the stationary probability using rejection sampling.

  get_sample_reject(Jx|R| matrix, Jx1 matrix, |R|x1 matrix) -> |R|x1 matrix

  """
  n = np.zeros(V.shape)
  rejected = 0
  
  while rejected < 1e4:
    for r in range(V.shape[0]):
      n[r,0] = np.random.poisson(V[r,0])

    if (A*n <= C).all():
      break
    else:
      rejected += 1

  if rejected >= 1e4:
    raise Exception("Sampling error")

  return n

if name == '__main__':
  A = A_star(25)
  V = 1*np.ones((A.shape[1], 1))
  C = 0*np.ones((A.shape[0], 1))

  m = 1;
  err = abs(1 - success_efpa_r(A, C, V, 0) - 0.05)
  for _ in range(120):
    C += 1
    err = abs(1 - success_efpa_r(A, C, V, 0) - 0.05)
    print "%d, %.4f, %.4f" % (C[0,0], 1 - success_efpa_r(A, C, V, 0), err)
    
```

Appendix: Fast Probabilistic Bisection {#app:bisect}
======================================

    function x = prob_bisection_fast()
        N = 50; p = 0.6; q = 1-p;
        % start with g(x) = step function around 1/2
        g = @(xn) 0.2532 .* (-1).^(xn >= 1/2);
        
        % noise Y is normal(0,0.1^2)
        Y = @(xn) g(xn) + 0.1*randn(size(xn));
        
        x = 1/2;
        xs = [0];
        fs = [1];
        
        for iter=2:N
            
            % Check the sign of this point
            Z = (Y(x) > 0);

            % Update posterior
            i = find(xs >= x, 1);
            if ~isempty(i) % insert this x into the arrays
                xs = [xs(1:(i-1)), x, xs(i:end)];
                fs = [fs(1:(i-1)), fs(i-1), fs(i:end)]
            else % this x is the largest one considered so far
                i = numel(xs)+1;
                xs = [xs, x];
                fs = [fs, fs(end)];
            end
            
            if Z == 1
               fs(i:end) = fs(i:end) .* 2*p
               fs(1:(i-1)) = fs(1:(i-1)) .* 2*q
            else
               fs(i:end) = fs(i:end) .* 2*q
               fs(1:(i-1)) = fs(1:(i-1)) .* 2*p
            end
            
            % Pick next point
            Fs = cumsum(diff([xs, 1]) .* fs(1));
            dist = makedist('piecewiselinear', xs, [0, Fs]);
            x = median(dist)
            
            stairs(xs, fs);
            title(sprintf('Posterior after %d steps', iter-1));
            drawnow;
        end
    end

Asmussen, S. and Glynn, P. W. (2007). , volume 57. Springer.

Blum, J. R. (1954a). Approximation methods which converge with
probability one. , pages 382–386.

Blum, J. R. (1954b). Multidimensional stochastic approximation methods.
, pages 737–744.

Broadie, M., Cicek, D. M., and Zeevi, A. (2014). Multidimensional
stochastic approximation: Adaptive algorithms and applications. ,
24(1):6.

Chen, H. and Schmeiser, B. W. (1994). Retrospective approximation
algorithms for stochastic root finding. In [*Proceedings of the 26th
Conference on Winter Simulation*]{}, WSC ’94, pages 255–261, San Diego,
CA, USA. Society for Computer Simulation International.

Chen, H.-F. (2002). Stochastic approximation and its applications,
volume 64 of nonconvex optimization and its applications.

Dunkel, J. and Weber, S. (2010). Stochastic root finding and efficient
estimation of convex risk measures. , 58(5):1505–1521.

Healy, K. and Schruben, L. W. (1991). Retrospective simulation response
optimization. In [*Proceedings of the 23rd Conference on Winter
Simulation*]{}, WSC ’91, pages 901–906, Washington, DC, USA. IEEE
Computer Society.

Kelly, F. P. (1991). Loss networks. , pages 319–378.

Kiefer, J. and Wolfowitz, J. (1952). Stochastic estimation of the
maximum of a regression function. , 23(3):462–466.

Kroese, D., Taimre, T., and Botev, Z. I. (2011). . Wiley.

Kushner, H. J. and Yin, G. G. (2003). . Springer.

Lo[è]{}ve, M. et al. (1951). On almost sure convergence. In
[*Proceedings of the Second Berkeley Symposium on Mathematical
Statistics and Probability*]{}. The Regents of the University of
California.

Mandjes, M. (1997). Fast simulation of blocking probabilities in loss
networks. , 101(2):393 – 405.

Pasupathy, R. and Kim, S. (2011). The stochastic root-finding problem:
Overview, solutions, and open questions. , 21(3):19.

Pasupathy, R. K. (2005). . PhD thesis, Purdue University, West
Lafayette, IN, USA.

Polyak, B. T. and Juditsky, A. B. (1992). Acceleration of stochastic
approximation by averaging. , 30(4):838–855.

Robbins, H. and Monro, S. (1951). A stochastic approximation method. ,
pages 400–407.

Rubinstein, R. Y. (1997). Optimization of computer simulation models
with rare events. , 99(1):89 – 112.

Rubinstein, R. Y. and Shapiro, A. (1993). , volume 346. Wiley New York.

Ruppert, D. (1988). Efficient estimations from a slowly convergent
robbins-monro process. Technical report, Cornell University Operations
Research and Industrial Engineering.

Ruppert, D. (1991). Stochastic approximation. , pages 503–529.

Shapiro, A. (1991). Asymptotic analysis of stochastic programs. ,
30(1):169–186.

Spall, J. C. (1987). A stochastic approximation technique for generating
maximum likelihood parameter estimates. In [*American Control
Conference, 1987*]{}, pages 1161–1167. IEEE.

Spall, J. C. (1998). An overview of the simultaneous perturbation method
for efficient optimization. , 19(4):482–492.

Spall, J. C. (2000). Adaptive stochastic approximation by the
simultaneous perturbation method. , 45(10):1839–1853.

Spall, J. C. (2005). , volume 65. John Wiley & Sons.

Waeber, R., Frazier, P. I., and Henderson, S. G. (2011). A bayesian
approach to stochastic root finding. In [*Simulation Conference (WSC),
Proceedings of the 2011 Winter*]{}, pages 4033–4045. IEEE.

Wang, H. and Schmeiser, B. (2008). Discrete stochastic optimization
using linear interpolation. In [*Simulation Conference, 2008. WSC 2008.
Winter*]{}, pages 502–508.

Wolfowitz, J. (1952). On the stochastic approximation method of robbins
and monro. , pages 457–461.

Wright, S. and Nocedal, J. (1999). , volume 2. Springer New York.

[^1]: Note: the question of convergence speed was omitted from this
    report to reduce scope, and because it isn’t as interesting a topic
    to cover.

[^2]: Also could choose $-\infty < \epsilon_1 < \epsilon_2 < \theta$.

[^3]: The error appears to be asymmetric whereas Rastrigin’s function is
    a symmetric function. Perhaps caused by a bug or a result of the
    function’s strangeness.
