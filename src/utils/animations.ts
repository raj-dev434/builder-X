// CSS Animation utilities for BuilderX
export const animationStyles = `
  /* Entrance Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slideInDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes slideInLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes zoomIn {
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes rotateIn {
    from { transform: rotate(-200deg); opacity: 0; }
    to { transform: rotate(0deg); opacity: 1; }
  }

  @keyframes flipInX {
    from { transform: perspective(400px) rotateX(90deg); opacity: 0; }
    to { transform: perspective(400px) rotateX(0deg); opacity: 1; }
  }

  @keyframes flipInY {
    from { transform: perspective(400px) rotateY(90deg); opacity: 0; }
    to { transform: perspective(400px) rotateY(0deg); opacity: 1; }
  }

  /* Exit Animations */
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes slideOutUp {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-100%); opacity: 0; }
  }

  @keyframes slideOutDown {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(100%); opacity: 0; }
  }

  @keyframes slideOutLeft {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(-100%); opacity: 0; }
  }

  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }

  @keyframes zoomOut {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(0); opacity: 0; }
  }

  @keyframes bounceOut {
    0% { transform: scale(1); }
    25% { transform: scale(0.95); }
    50% { transform: scale(1.1); }
    100% { transform: scale(0.3); opacity: 0; }
  }

  @keyframes rotateOut {
    from { transform: rotate(0deg); opacity: 1; }
    to { transform: rotate(200deg); opacity: 0; }
  }

  @keyframes flipOutX {
    from { transform: perspective(400px) rotateX(0deg); opacity: 1; }
    to { transform: perspective(400px) rotateX(90deg); opacity: 0; }
  }

  @keyframes flipOutY {
    from { transform: perspective(400px) rotateY(0deg); opacity: 1; }
    to { transform: perspective(400px) rotateY(90deg); opacity: 0; }
  }

  /* Hover Animations */
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0, -30px, 0); }
    70% { transform: translate3d(0, -15px, 0); }
    90% { transform: translate3d(0, -4px, 0); }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }

  @keyframes wobble {
    0% { transform: translateX(0%); }
    15% { transform: translateX(-25%) rotate(-5deg); }
    30% { transform: translateX(20%) rotate(3deg); }
    45% { transform: translateX(-15%) rotate(-3deg); }
    60% { transform: translateX(10%) rotate(2deg); }
    75% { transform: translateX(-5%) rotate(-1deg); }
    100% { transform: translateX(0%); }
  }

  @keyframes tada {
    0% { transform: scale(1); }
    10%, 20% { transform: scale(0.9) rotate(-3deg); }
    30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
    40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
    100% { transform: scale(1) rotate(0); }
  }

  @keyframes jello {
    0%, 11.1%, 100% { transform: translate3d(0, 0, 0); }
    22.2% { transform: skewX(-12.5deg) skewY(-12.5deg); }
    33.3% { transform: skewX(6.25deg) skewY(6.25deg); }
    44.4% { transform: skewX(-3.125deg) skewY(-3.125deg); }
    55.5% { transform: skewX(1.5625deg) skewY(1.5625deg); }
    66.6% { transform: skewX(-0.78125deg) skewY(-0.78125deg); }
    77.7% { transform: skewX(0.390625deg) skewY(0.390625deg); }
    88.8% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg); }
  }

  @keyframes heartbeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.3); }
    28% { transform: scale(1); }
    42% { transform: scale(1.3); }
    70% { transform: scale(1); }
  }

  @keyframes rubberBand {
    0% { transform: scale(1); }
    30% { transform: scaleX(1.25) scaleY(0.75); }
    40% { transform: scaleX(0.75) scaleY(1.25); }
    50% { transform: scaleX(1.15) scaleY(0.85); }
    65% { transform: scaleX(0.95) scaleY(1.05); }
    75% { transform: scaleX(1.05) scaleY(0.95); }
    100% { transform: scale(1); }
  }

  @keyframes swing {
    20% { transform: rotate(15deg); }
    40% { transform: rotate(-10deg); }
    60% { transform: rotate(5deg); }
    80% { transform: rotate(-5deg); }
    100% { transform: rotate(0deg); }
  }

  /* Animation Classes */
  .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
  .animate-slideInUp { animation: slideInUp 0.5s ease-out; }
  .animate-slideInDown { animation: slideInDown 0.5s ease-out; }
  .animate-slideInLeft { animation: slideInLeft 0.5s ease-out; }
  .animate-slideInRight { animation: slideInRight 0.5s ease-out; }
  .animate-zoomIn { animation: zoomIn 0.5s ease-out; }
  .animate-bounceIn { animation: bounceIn 0.6s ease-out; }
  .animate-rotateIn { animation: rotateIn 0.5s ease-out; }
  .animate-flipInX { animation: flipInX 0.6s ease-out; }
  .animate-flipInY { animation: flipInY 0.6s ease-out; }

  .animate-fadeOut { animation: fadeOut 0.5s ease-in-out; }
  .animate-slideOutUp { animation: slideOutUp 0.5s ease-in; }
  .animate-slideOutDown { animation: slideOutDown 0.5s ease-in; }
  .animate-slideOutLeft { animation: slideOutLeft 0.5s ease-in; }
  .animate-slideOutRight { animation: slideOutRight 0.5s ease-in; }
  .animate-zoomOut { animation: zoomOut 0.5s ease-in; }
  .animate-bounceOut { animation: bounceOut 0.6s ease-in; }
  .animate-rotateOut { animation: rotateOut 0.5s ease-in; }
  .animate-flipOutX { animation: flipOutX 0.6s ease-in; }
  .animate-flipOutY { animation: flipOutY 0.6s ease-in; }

  .hover\\:animate-pulse:hover { animation: pulse 1s infinite; }
  .hover\\:animate-bounce:hover { animation: bounce 1s infinite; }
  .hover\\:animate-shake:hover { animation: shake 0.5s ease-in-out; }
  .hover\\:animate-wobble:hover { animation: wobble 1s ease-in-out; }
  .hover\\:animate-tada:hover { animation: tada 1s ease-in-out; }
  .hover\\:animate-jello:hover { animation: jello 0.9s ease-in-out; }
  .hover\\:animate-heartbeat:hover { animation: heartbeat 1.5s ease-in-out infinite; }
  .hover\\:animate-rubberBand:hover { animation: rubberBand 1s ease-in-out; }
  .hover\\:animate-swing:hover { animation: swing 1s ease-in-out; }
`;

export const getAnimationClass = (animation: string, type: 'entrance' | 'exit' | 'hover' = 'entrance'): string => {
  if (!animation) return '';
  
  const prefix = type === 'hover' ? 'hover:animate-' : 'animate-';
  return `${prefix}${animation}`;
};

export const getAnimationStyle = (props: any): React.CSSProperties => {
  const {
    animation,
    customAnimation,
    animationDuration,
    animationDelay,
    animationIterationCount,
    animationDirection,
    animationTimingFunction,
    animationFillMode
  } = props;

  const style: React.CSSProperties = {};

  if (animation) {
    style.animationName = animation;
  }

  if (customAnimation) {
    style.animationName = customAnimation;
  }

  if (animationDuration) {
    style.animationDuration = animationDuration;
  }

  if (animationDelay) {
    style.animationDelay = animationDelay;
  }

  if (animationIterationCount) {
    style.animationIterationCount = animationIterationCount;
  }

  if (animationDirection) {
    style.animationDirection = animationDirection;
  }

  if (animationTimingFunction) {
    style.animationTimingFunction = animationTimingFunction;
  }

  if (animationFillMode) {
    style.animationFillMode = animationFillMode;
  }

  return style;
};

export const injectAnimationStyles = () => {
  if (typeof document === 'undefined') return;
  
  const existingStyle = document.getElementById('builderx-animations');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'builderx-animations';
  style.textContent = animationStyles;
  document.head.appendChild(style);
};
