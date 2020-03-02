---
layout: post
title: Stochastic root-finding review
subtitle:
tags: [math, monte carlo]
author: pjl
banner: srf_iterates.png
banner_alt: Rastrigin's function
excerpt: >
    A review of algorithms for the SRF problem -- that is, when you want to
    find a root of a function, but you only have access to a random function
    whose mean is the true underlying function.
mathjax: true
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
{% cite Pasupathy2011 %}, is an example of a stochastic root-finding problem.

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

In {% cite Robbins1951 %}, Robbins & Monro introduced the iterative algorithm
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
field. The following year {% cite Wolfowitz1952 %} answered two questions
proposed by the original paper, and then {% cite Kiefer1952 %} proposed an
extension to RM-SA which incorporated finite-differences to estimate
$g'(x)$. In the following years Kiefer & Wolfowitz’s algorithm received less
attention than the original RM-SA {% cite Ruppert1991 %}. Now, any stochastic
approximation algorithm using a finite-differences derivative estimate
is classed as a Kiefer-Wolfowitz stochastic approximation (KW-SA).

Significant work has since gone into relaxing the conditions in the
algorithms of {% cite Robbins1951 %} and {% cite Kiefer1952 %}, and into generalising
their results (both only considered problems in one dimension).
{% cite Blum1954 %} proved that RM-SA convergence occurred with probability one,
and was the first to prove the same result for the multidimensional
extension in {% cite Blum1954multi %}.

Unfortunately KW-SA did not extend to high-dimensions gracefully.
Traditionally finite differences approximation of ${\nabla}f(x)$ in $q$
dimensions requires $q+1$ evaluations of the $f$ function. {% cite Spall1987 %}
introduced a method for approximating the derivative using only two
function evaluations, called Simultaneous Perturbation Stochastic
Approximation (SPSA). The name is (perhaps obviously) derived from the
fact that the method perturbs every direction at the same time, trading
off accuracy for a significantly faster compute time (for large $q$).
See {% cite Spall1998 %} for a well-written introduction to the field, and
{% cite Spall2000 %} for a more developed form of SPSA.

One large implementation problem when using these algorithms is to
choose which sequence/s should be supplied to the algorithm. In RM-SA
the user must specify a step-size sequence $a_n$ such that

$$\sum_{i=0}^\infty a_i = \infty, \quad \sum_{i=0}^\infty a_i^2 < \infty.$$

Though the asymptotic results for rate of convergence hold for any
$a_n$, it has been seen that the finite-time performance is hugely
impacted by this selection. {% cite Robbins1951 %} originally suggested the form
$a_n = 1/n$ which is very similar to the best current rule-of-thumb 62
years later {% cite Pasupathy2011 %}.

{% cite Polyak1992 %} and {% cite Ruppert1988 %} independently arrived at a method to
diminish the impact of a poor selection of $a_n$. They suggested larger
step sizes than the typical $a_n = 1/n$ and using
$\bar{X}_n = \sum_{i=0}^n X_i$ - the sample mean of the iterates - as
the estimator of the root. This is shown to have the same optimal
asymptotic rate of convergence as standard RM-SA yet with better
finite-time characteristics {% cite Thehandbook11 %}, and is now very commonly
used in practice {% cite Asmussen2007 %}. An in-depth look at all stochastic
approximation techniques and results can be found in {% cite Kushner2003 %},
{% cite Chen2002 %}, and {% cite Spall2005 %}.

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
{% cite Wright1999 %}). There are some major advantages to SC over SA.
{% cite Pasupathy2011 %} states that SC, when compared to SA, is very
conceptually simple and that it is powerful as the tools developed for
DRFPs can be utilised. In modern times SC is likely to be preferred over
SA as it is easily parallelisable. Also SC allows examination of
non-differentiable functions which would confuse SA methods {% cite Wang2008 %}.

Initial work on the stochastic counterpart method arose from
{% cite Healy1991 %} looking at a related concept which is retrospective
optimization methodology. This work discussed the notion of optimizing
the performance of a stochastic system – the context given was resource
allocation and queuing problems – over a selection of available
decisions. {% cite Chen1994 %} then formally applied the methodology to
stochastic root finding, and Schmeiser’s PhD student Pasupathy
generalised the results to multiple dimensions {% cite Pasupathy2005 %}. Initial
results on convergence were already proved by {% cite Shapiro1991 %} in the
context of stochastic optimization. The topic is well-explained by many
books, including: {% cite Rubinstein1993 %}, {% cite Spall2005 %}, and {% cite Thehandbook11 %}.

{% cite Rubinstein1997 %} built on the original work on the stochastic
counterpart method and produced a landmark application of the method for
rare-event simulations. A simplified explanation can be found in
{% cite Thehandbook11 %}, which describes how stochastic counterpart is a vital
component of the cross-entropy method.

Modern work on stochastic approximation techniques seeks to automate the
task of parameter selection. {% cite Spall2000 %} outlines an adaptive extension
to SPSA. Very recently {% cite Broadie2014 %} outlined a fully adaptive
extension to both RMSA and KWSA which works well in practice, yet has
little founding in rigorous proofs. Another recent application of
stochastic approximation is in evaluating portfolio risk, cf
{% cite Dunkel2010 %}.

To conclude, a completely different approach to solving SRFPs called the
probabilistic bisection method by {% cite Waeber2011 %} will be described.
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
  2p(x) f_n(x),     & \text{if }x > X_n    \\
  2(1-p(x)) f_n(x), & \text{if }x \leq X_n
 \end{cases}$$

else $Z_n = -1$ and

$$f_{n+1}(x) =
 \begin{cases}
  2(1-p(x)) f_n(x), & \text{if }x > X_n     \\
  2p(x) f_n(x),     & \text{if }x \leq X_n.
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

Results listed below are adapted from the original proof by {% cite Blum1954 %}.

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
point” {% cite Pasupathy2011 %}.

**Lemma 1** If $\eqref{B}$ and $\eqref{D}$ hold then the sequence
$\{ X_{n+1} + \sum_{j=1}^n a_j g(X_j) \}$ converges to a random variable
with probability one.

{% cite Blum1954 %} cites Lemma 1 as a minor extension of Lemma 5.2
in {% cite Loeve1951 %}.

**Lemma 2** If $\eqref{B}$, $\eqref{C}$, $\eqref{D}$ and $\eqref{E}$
hold then $X_n$ converges w.p.1.

First want to show

\begin{equation} \label{conv:fin}
{\mathbb{P}}\left(\lim_{n\rightarrow \infty} X_n = \pm \infty\right) = 0.
\end{equation}

Suppose $\{X_n \}$ is a sample sequence which diverges to $+\infty$ (a
similar argument holds for $-\infty$). This means $X_n \leq \theta$ for
only finitely many $n$, so $\eqref{E}$ $\Rightarrow a_ng(X_n) > 0$ for
large enough $n$. Then in the limit

$$\lim_{n\rightarrow \infty} X_{n+1} + \sum_{j=1}^n a_jg(X_j) =+\infty$$

whereas Lemma 1 states this limit converges with probability
one. Therefore the limit diverges with probability zero and we have
shown $\eqref{conv:fin}$ to be true.

Assume the statement of the lemma is false and it will be proved by
contradiction. Lemma 1 and $\eqref{conv:fin}$ imply that
there exist sample sequences with positive probability such that

\begin{equation} \label{contr1}
  X_{n+1} + \sum_{j=1}^n a_jg(X_j) \text{ converges to a finite number.}
\end{equation}

and the assumption of the lemma being false implies

\begin{equation} \label{contr2}
  \lim \inf X_n < \lim \sup X_n.
\end{equation}

Select such a sequence of $X_n$ and
w.l.o.g assume $\lim \sup X_n > \theta$. We can select numbers $a$ and
$b$ such that

$$a > \theta, \quad \lim \inf X_n < a < b < \lim \sup X_n$$

Now for $N$
large enough then $N \leq n < m$ means

\begin{equation} \label{anbounds}
  a_n \leq \min \left\\{ \frac{1}{3d}, \frac{b-a}{3(c + d|\theta|)} \right\\}
\end{equation}

which is fine since $\eqref{B}$ implies $a_n \rightarrow 0$, and also

\begin{equation} \label{bound}
  \left| X_m - X_n + \sum_{j=n}^{m-1} a_j g(X_j) \right| \leq \frac{b-a}{3}
\end{equation}

which is justified by $\eqref{contr1}$. Fix values for $m$ and $n$ so
that

\begin{equation} \label{summands}
  N \leq n < m, \quad X_n < a, \quad X_m > b, \quad n < j < m \Rightarrow a \leq X_j \leq b.
\end{equation}

In particular note that for $n<j<m$ then $\eqref{summands}$ &
$\eqref{E}$ means that $a_jg(X_j) > 0$. By rearranging $\eqref{bound}$
and applying this note we can see that

\begin{equation} \label{ineq}
  X_m - X_n \leq \frac{b-a}{3} - \sum_{j=n}^{m-1} a_jg(X_j)
  \leq \frac{b-a}{3} - a_ng(X_n)
\end{equation}

To finish the proof we take cases. If
$\theta < X_n$ then $g(X_n) > 0$ so $\eqref{ineq}$ states that

$$X_m - X_n \leq \frac{b-a}{3}$$

but $\eqref{summands}$ implies that
$X_m - X_n > b-a$, so a contradiction! This leaves considering the case
where $X_n \leq \theta$, so $g(X_n) < 0$ and by $\eqref{C}$:

$$\begin{align}
  -g(X_n) & = |g(X_n)| \notag \\
      & \leq c + d|X_n| \notag \\
      & \leq c + d|\theta| + d|\theta - X_n| \notag  \\
      & \leq c + d|\theta| + d(X_m - X_n)  \label{ineq2}
\end{align} $$

So plugging $\eqref{ineq2}$ into $\eqref{ineq}$ gives

$$ \begin{aligned}
 \label{anothercontr}
  X_m - X_n & \leq \frac{b-a}{3} + a_n(c + d|\theta| + d(X_m - X_n))                                                                                                   \\
        & = \frac{b-a}{3} + a_n(c + d|\theta|) + a_n d(X_m - X_n)                                                                                                  \\
        & \leq \frac{b-a}{3} + \left(\frac{b-a}{3(c+d|\theta|)}\right)(c + d|\theta|) + \left(\frac{1}{3d}\right) d(X_m - X_n) \qquad \text{ by $\eqref{anbounds}$} \\
        & \leq \frac{b-a}{3} + \frac{b-a}{3} + \frac{X_m - X_n}{3}
\end{aligned} $$

Collecting $X_m - X_n$ terms together and multiplying
by $\frac{3}{2}$ gives

$$(X_m-X_n) \leq b-a$$

which again contradicts
$X_m - X_n > b-a$ from $\eqref{summands}$! Therefore all cases lead to a
contradiction so the lemma is proved.

If conditions $\eqref{A}$-$\eqref{F}$ hold then the Robbins-Monro
iterates $X_n$ converge to the root $\theta$ w.p.1.

We have from Lemma 2 that

$${\mathbb{P}}\left(\lim_{n\rightarrow\infty} X_n = X\right) = 1$$

for
some $X$. Again seek a contradiction by assuming that

$${\mathbb{P}}\left(X \not= \theta\right) > 0.$$

Choose some
$\epsilon_1, \epsilon_2$ s.t.
$\theta < \epsilon_1 < \epsilon_2 < \infty$[^2] and

\begin{equation} \label{epsilon}
  {\mathbb{P}}(\epsilon_1 < X < \epsilon_2) > 0
\end{equation}

Consider all the
sequences $X_n$ that, for a chosen $(\epsilon_1, \epsilon_2)$, satisfy
$\eqref{epsilon}$. For $n$ large enough then

$$\epsilon_1 \leq X_n \leq \epsilon_2.$$

The set of all such sequences
has positive probability. Lemma 1 states that

$$X_{n+1} + \sum_{j=1}^n a_j g(X_j) \text{ converges w.p.1}.$$

Yet
consider applying $\eqref{F}$ so that

$$g(X_n) > 0$$

eventually and as
$\eqref{A}$ states the $a_n$ also diverge so overall this sum would
diverge almost surely. This is contradiction!

See {% cite Kushner2003 %} for many more proofs on convergence guarantees and
convergence speed of stochastic approximation algorithms.

Algorithms
==========

![image](/images/pseudocode_srf.png){: .image .post_image}

The probabilistic bisection algorithm was sufficiently described in the
text of the literature review.

MATLAB Implementation
---------------------

```matlab
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
```


[^1]: Note: the question of convergence speed was omitted from this
report to reduce scope, and because it isn’t as interesting a topic
to cover.

[^2]: Also could choose $-\infty < \epsilon_1 < \epsilon_2 < \theta$.

[^3]: The error appears to be asymmetric whereas Rastrigin’s function is
a symmetric function. Perhaps caused by a bug or a result of the
function’s strangeness.

{% bibliography --cited %}
