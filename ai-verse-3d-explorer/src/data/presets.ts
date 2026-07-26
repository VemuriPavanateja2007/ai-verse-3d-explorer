import { ConceptData } from '../types';

export const PRESET_CONCEPTS: Record<string, ConceptData> = {
  dnn: {
    id: 'dnn',
    title: 'Deep Neural Network (DNN) & Backprop',
    subtitle: 'Multilayer Perceptron with Gradient Optimization',
    category: 'dnn',
    badge: 'Neural Core',
    summary:
      'A fully connected feedforward architecture mapping high-dimensional inputs through hidden non-linear layers. Forward propagation computes predictions, while reverse error signals backpropagate gradients using the chain rule to update synaptic weights.',
    architectureBreakdown: [
      {
        id: 'layer-0',
        name: 'Input Layer',
        role: 'Feature Vector Ingestion',
        nodesCount: 16,
        dimensions: '16 x 1',
        activationFunction: 'Linear / Identity',
        description: 'Ingests normalized feature vectors ($x_1, x_2, \\dots, x_{16}$) from raw datasets.',
        details: [
          'Preprocessed continuous and categorical features',
          'No parameters or learnable weights in this stage',
          'Feeds directly into Hidden Layer 1 via dense synaptic matrix'
        ]
      },
      {
        id: 'layer-1',
        name: 'Hidden Layer 1 (Feature Extraction)',
        role: 'Non-Linear Representation',
        nodesCount: 12,
        dimensions: '12 x 1',
        activationFunction: 'GELU / ReLU',
        description: 'Computes affine transformation $z = W_1 x + b_1$ followed by non-linear activation.',
        details: [
          'Extracts low-level non-linear feature combinations',
          'Dense connectivity: 16 x 12 = 192 weights + 12 biases',
          'Enables non-planar decision boundaries in latent space'
        ]
      },
      {
        id: 'layer-2',
        name: 'Hidden Layer 2 (Abstract Fusion)',
        role: 'Deep Representation Learning',
        nodesCount: 8,
        dimensions: '8 x 1',
        activationFunction: 'Swish / SiLU',
        description: 'Fuses low-level features into complex high-level abstract representations.',
        details: [
          'Combines 12 input features into 8 latent dimensions',
          '12 x 8 = 96 trainable weights + 8 biases',
          'Regularized with Dropout ($p=0.1$) during training'
        ]
      },
      {
        id: 'layer-3',
        name: 'Output Layer (Logits / Decision)',
        role: 'Classification & Probability Distribution',
        nodesCount: 4,
        dimensions: '4 x 1',
        activationFunction: 'Softmax / Sigmoid',
        description: 'Produces final class logits normalized into a valid probability distribution.',
        details: [
          'Maps 8 latent units to 4 categorical target classes',
          'Loss computed via Cross-Entropy against ground truth',
          'Triggers error backpropagation through computational graph'
        ]
      }
    ],
    mathFormulas: [
      {
        title: 'Forward Affine Transformation',
        expression: 'z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)}',
        description: 'Matrix product of synaptic weight matrix $W$ and activations $a$ plus bias vector $b$.'
      },
      {
        title: 'GELU Activation Function',
        expression: 'a^{(l)} = x \\cdot \\Phi(x) \\approx 0.5 x \\left(1 + \\tanh\\left(\\sqrt{\\frac{2}{\\pi}} \\left(x + 0.044715 x^3\\right)\\right)\\right)',
        description: 'Smooth non-linear activation combining properties of stochastic dropout and ReLU.'
      },
      {
        title: 'Loss Function (Cross-Entropy)',
        expression: '\\mathcal{L}(y, \\hat{y}) = -\\sum_{i=1}^{C} y_i \\log(\\hat{y}_i)',
        description: 'Measures dissimilarity between true target distribution $y$ and predicted logits $\\hat{y}$.'
      },
      {
        title: 'Weight Gradient via Chain Rule',
        expression: '\\frac{\\partial \\mathcal{L}}{\\partial W^{(l)}} = \\delta^{(l)} \\left(a^{(l-1)}\\right)^T, \\quad \\delta^{(l)} = \\left(W^{(l+1)}\\right)^T \\delta^{(l+1)} \\odot \\sigma\'\\left(z^{(l)}\\right)',
        description: 'Backpropagates error signal $\\delta$ backward through layers to compute weight updates.'
      }
    ],
    keyHighlights: [
      'Bidirectional signal flow: Forward prediction vs. Backward weight update gradient pulse',
      'Interactive synaptic weights: Click nodes to inspect activation values, bias, and local gradients',
      'Adjustable Learning Rate ($\\\\eta$) to observe gradient magnitude changes in real-time'
    ],
    parameters: [
      { label: 'Learning Rate (η)', key: 'learningRate', value: 0.01, min: 0.001, max: 0.1, step: 0.001 },
      { label: 'Signal Flow Speed', key: 'flowSpeed', value: 1.5, min: 0.5, max: 3.0, step: 0.1 },
      { label: 'Synaptic Glow Intensity', key: 'glow', value: 1.0, min: 0.2, max: 2.0, step: 0.1 }
    ]
  },
  cnn: {
    id: 'cnn',
    title: 'Convolutional Network (CNN) Feature Decomposition',
    subtitle: 'Spatial Feature Hierarchies & Kernel Operators',
    category: 'cnn',
    badge: 'Computer Vision',
    summary:
      'A spatial processing network utilizing 2D/3D sliding kernels to extract spatial visual hierarchies—translating raw pixel grids into low-level edges, mid-level textures, and high-level object part compositions.',
    architectureBreakdown: [
      {
        id: 'layer-0',
        name: 'Input Image Tensor',
        role: 'Spatial RGB Ingestion',
        nodesCount: 1,
        dimensions: '224 x 224 x 3',
        description: 'Raw high-resolution input tensor representing RGB pixel channels.',
        details: [
          '3 channels (Red, Green, Blue)',
          'Normalized range [-1.0, +1.0]',
          'Spatial geometry preserved across receptive field'
        ]
      },
      {
        id: 'layer-1',
        name: 'Conv2D Layer 1 + ReLU (Edge Detection)',
        role: 'Low-Level Feature Map',
        nodesCount: 16,
        dimensions: '112 x 112 x 16',
        activationFunction: 'ReLU ($f(x) = \\max(0, x)$)',
        description: '3x3 sliding kernels detect directional gradient edges, contours, and color transitions.',
        details: [
          '16 learnable filter kernels with stride 2',
          'Extracts horizontal, vertical, and diagonal edges',
          'Drastically reduces spatial memory footprint'
        ]
      },
      {
        id: 'layer-2',
        name: 'Conv2D Layer 2 + MaxPool (Texture & Motifs)',
        role: 'Mid-Level Pattern Abstraction',
        nodesCount: 32,
        dimensions: '56 x 56 x 32',
        activationFunction: 'ReLU + Max Pooling',
        description: 'Combines low-level edge kernels to detect geometric shapes, textures, and corner motifs.',
        details: [
          '32 filter channels capturing complex spatial patterns',
          '2x2 Max Pooling enforces translation invariance',
          'Focuses on dominant local activations'
        ]
      },
      {
        id: 'layer-3',
        name: 'Conv2D Layer 3 (High-Level Part Detector)',
        role: 'Semantic Feature Composition',
        nodesCount: 64,
        dimensions: '28 x 28 x 64',
        activationFunction: 'GELU',
        description: 'Assembles shapes into semantic object parts (e.g., eyes, wheels, text glyphs).',
        details: [
          '64 deep feature channels with rich spatial context',
          'Receptive field spans large input image sub-regions',
          'Prepares dense representations for spatial classification'
        ]
      },
      {
        id: 'layer-4',
        name: 'Global Pooling & FC Layer',
        role: 'Spatial Reduction & Logits',
        nodesCount: 10,
        dimensions: '10 x 1',
        activationFunction: 'Softmax',
        description: 'Global average pooling collapses spatial dimensions into class probabilities.',
        details: [
          'Flattened 64-dim vector mapped to class logits',
          'Invariant to spatial position of target object',
          'Outputs confidence scores across categories'
        ]
      }
    ],
    mathFormulas: [
      {
        title: '2D Discrete Convolution Operator',
        expression: 'S(i, j) = (I * K)(i, j) = \\sum_{m} \\sum_{n} I(i-m, j-n) K(m, n)',
        description: 'Cross-correlation sum of input pixel region $I$ multiplied elementwise by kernel $K$.'
      },
      {
        title: 'ReLU Activation',
        expression: 'f(x) = \\max(0, x)',
        description: 'Introduces non-linearity by zeroing negative values and passing positive signals unchanged.'
      },
      {
        title: 'Max Pooling Downsampling',
        expression: 'P(i, j) = \\max_{(m,n) \\in \\Omega} I(2i+m, 2j+n)',
        description: 'Extracts the maximum response within local window $\\Omega$, providing spatial shift tolerance.'
      }
    ],
    keyHighlights: [
      'Explodable 3D Layer Sandwich: Drag the Explode Distance slider to separate 3D feature slices',
      '3D Scanning Filter Kernel: Real-time box scanning across feature layers with kernel weight overlay',
      'Hierarchical visual breakdown from edge maps up to high-level classification'
    ],
    parameters: [
      { label: 'Layer Explode Distance', key: 'explodeDistance', value: 2.2, min: 0.5, max: 4.5, step: 0.1 },
      { label: 'Filter Scan Speed', key: 'scanSpeed', value: 1.0, min: 0.2, max: 3.0, step: 0.1 },
      { label: 'Layer Transparency', key: 'transparency', value: 0.75, min: 0.2, max: 1.0, step: 0.05 }
    ]
  },
  transformer: {
    id: 'transformer',
    title: 'Transformers & Self-Attention ("Attention City")',
    subtitle: 'Scaled Dot-Product & Topological Attention Landscape',
    category: 'transformer',
    badge: 'NLP & Sequence Architecture',
    summary:
      'The foundational self-attention mechanism that computes pairwise contextual relationships between all tokens in a sequence simultaneously, mapping query-key interactions into a 3D topological heightmap.',
    architectureBreakdown: [
      {
        id: 'layer-0',
        name: 'Input Token Embeddings + Positional Encoding',
        role: 'Semantic Vector Space',
        nodesCount: 10,
        dimensions: '10 x 512',
        description: 'Converts input discrete token strings into dense 512-dimensional continuous vectors.',
        details: [
          'Adds sinusoidal or rotary (RoPE) positional encodings',
          'Preserves order information without sequential recurrence',
          'Feeds into Query ($Q$), Key ($K$), Value ($V$) projection matrices'
        ]
      },
      {
        id: 'layer-1',
        name: 'Multi-Head Linear Projections (Q, K, V)',
        role: 'Subspace Transformation',
        nodesCount: 8,
        dimensions: '8 Heads x 64 Dim',
        description: 'Projects embeddings into multiple independent Query, Key, and Value subspaces.',
        details: [
          '8 parallel attention heads learn distinct relational aspects',
          '$W_Q, W_K, W_V \\in \\mathbb{R}^{d_{model} \\times d_k}$',
          'Allows model to attend to syntactic, coreference, and semantic roles simultaneously'
        ]
      },
      {
        id: 'layer-2',
        name: 'Scaled Dot-Product Attention Matrix',
        role: 'Relational Weight Computation',
        nodesCount: 100,
        dimensions: '10 x 10 Attention Map',
        activationFunction: 'Softmax',
        description: 'Computes affinity matrix $S = \\text{Softmax}(QK^T / \\sqrt{d_k})$.',
        details: [
          '3D topological grid elevation represents attention weight magnitude',
          'Scaling factor $\\sqrt{d_k} = \\sqrt{64} = 8$ prevents vanishing softmax gradients',
          'Generates glowing 3D Bezier curves connecting token pairs'
        ]
      },
      {
        id: 'layer-3',
        name: 'Feed-Forward Network (FFN) & Add & Norm',
        role: 'Non-Linear Token Processing',
        nodesCount: 10,
        dimensions: '10 x 2048',
        activationFunction: 'SwiGLU + LayerNorm',
        description: 'Applies point-wise two-layer dense network with residual connection.',
        details: [
          'Residual connection $x + \\text{Sublayer}(x)$ prevents gradient degradation',
          'Layer Normalization stabilizes internal activation variances',
          'SwiGLU activation enhances expressiveness'
        ]
      }
    ],
    mathFormulas: [
      {
        title: 'Scaled Dot-Product Attention',
        expression: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V',
        description: 'Measures dot-product similarity between queries and keys, normalized via scaling factor and softmax.'
      },
      {
        title: 'Multi-Head Attention Assembly',
        expression: '\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O',
        description: 'Concatenates outputs from $h$ independent heads and projects back to model dimension $d_{model}$.'
      },
      {
        title: 'Sinusoidal Positional Encoding',
        expression: 'PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d}}\\right), \\quad PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d}}\\right)',
        description: 'Encodes positional offsets into high-frequency and low-frequency continuous wave patterns.'
      }
    ],
    keyHighlights: [
      '3D Attention City: Attention scores form glowing elevation peaks on a 3D grid',
      'Token Hover Bezier Connections: Hover over token "it" to trace glowing curves to "animal"',
      'Multi-Head Switcher: Toggle between Heads 1-8 to view distinct attention patterns'
    ],
    parameters: [
      { label: 'Active Attention Head', key: 'headIndex', value: 1, min: 0, max: 4, step: 1 },
      { label: 'Grid Elevation Scale', key: 'gridHeight', value: 1.8, min: 0.5, max: 3.5, step: 0.1 },
      { label: 'Curve Threshold', key: 'threshold', value: 0.15, min: 0.05, max: 0.5, step: 0.05 }
    ],
    tokens: ['The', 'animal', 'didn\'t', 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired'],
    attentionMatrix: [
      // Head 0 (Coreference: "it" -> "animal")
      [
        [0.8, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0],
        [0.05, 0.85, 0.02, 0.02, 0.0, 0.01, 0.0, 0.05, 0.0, 0.0, 0.0],
        [0.0, 0.05, 0.75, 0.1, 0.0, 0.0, 0.05, 0.05, 0.0, 0.0, 0.0],
        [0.0, 0.1, 0.05, 0.7, 0.05, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0, 0.1, 0.8, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0],
        [0.0, 0.1, 0.0, 0.15, 0.05, 0.7, 0.0, 0.0, 0.0, 0.0, 0.0],
        [0.0, 0.05, 0.0, 0.0, 0.0, 0.1, 0.65, 0.1, 0.05, 0.05, 0.0],
        [0.0, 0.78, 0.02, 0.01, 0.0, 0.02, 0.05, 0.1, 0.01, 0.0, 0.01], // "it" strongly attends to "animal" (0.78)
        [0.0, 0.05, 0.0, 0.0, 0.0, 0.0, 0.05, 0.1, 0.7, 0.05, 0.05],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.05, 0.1, 0.75, 0.1],
        [0.0, 0.6, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.05, 0.05, 0.2]
      ],
      // Head 1 (Syntactic Verb Dependency: "cross" -> "street")
      [
        [0.9, 0.05, 0.0, 0.0, 0.05, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [0.1, 0.7, 0.1, 0.05, 0.0, 0.05, 0.0, 0.0, 0.0, 0.0, 0.0],
        [0.0, 0.1, 0.8, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        [0.0, 0.05, 0.05, 0.3, 0.1, 0.45, 0.05, 0.0, 0.0, 0.0, 0.0], // "cross" attends to "street"
        [0.0, 0.0, 0.0, 0.05, 0.85, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0, 0.5, 0.1, 0.35, 0.05, 0.0, 0.0, 0.0, 0.0],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.8, 0.1, 0.0, 0.0, 0.0],
        [0.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.1, 0.7, 0.05, 0.05, 0.0],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.8, 0.1, 0.0],
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.4, 0.5], // "too" attends to "tired"
        [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.05, 0.25, 0.7]
      ]
    ]
  },
  llm: {
    id: 'llm',
    title: 'Large Language Model (LLM) Generation Engine',
    subtitle: 'Autoregressive Decoding & Context Window Ring',
    category: 'llm',
    badge: 'Generative AI',
    summary:
      'An autoregressive token generator that processes prompt tokens within a sliding 3D Context Window box, evaluating output logit probability distributions to predict and sample the next token.',
    architectureBreakdown: [
      {
        id: 'layer-0',
        name: 'Context Window Queue',
        role: 'Sliding Sequence Buffer',
        nodesCount: 8,
        dimensions: '8 Tokens Max Context',
        description: 'Maintains active tokens in working memory within a visual 3D bounding box.',
        details: [
          'Sliding FIFO queue dropping oldest tokens as new ones generate',
          'Prevents $O(N^2)$ memory explosion during long generations',
          'KV Cache stores key-value vectors to avoid recalculation'
        ]
      },
      {
        id: 'layer-1',
        name: 'Stacked Transformer Decoder Blocks',
        role: 'Representation Refinement',
        nodesCount: 32,
        dimensions: '32 Layers Deep',
        description: 'Propagates tokens through 32 stacked transformer layers with RMSNorm.',
        details: [
          'Rotary Position Embeddings (RoPE) injected per layer',
          'Grouped Query Attention (GQA) optimizes throughput',
          'MLP layers with SwiGLU non-linear expansions'
        ]
      },
      {
        id: 'layer-2',
        name: 'Vocabulary Logit Head & Temperature Sampling',
        role: 'Probability Distribution',
        nodesCount: 50,
        dimensions: '32,000 Vocab Size',
        activationFunction: 'Softmax with Temperature $T$',
        description: 'Transforms final hidden states into candidate token logits.',
        details: [
          'Temperature scaling: $P(w_i) = \\text{softmax}(z_i / T)$',
          'Top-P (Nucleus) sampling truncates low-probability tail tokens',
          'Highest sampled candidate appended to context window'
        ]
      }
    ],
    mathFormulas: [
      {
        title: 'Temperature Scaled Softmax',
        expression: 'P(x_i) = \\frac{\\exp(z_i / T)}{\\sum_{j} \\exp(z_j / T)}',
        description: 'Controls randomness: $T \\to 0$ approaches deterministic greedy selection, while higher $T$ increases generation variance.'
      },
      {
        title: 'Top-P (Nucleus) Truncation',
        expression: '\\sum_{x \\in V^{(p)}} P(x) \\ge p',
        description: 'Filters out tokens outside the smallest set $V^{(p)}$ whose cumulative probability exceeds $p$.'
      },
      {
        title: 'Autoregressive Joint Likelihood',
        expression: 'P(X) = \\prod_{t=1}^{T} P(x_t \\mid x_1, x_2, \\dots, x_{t-1})',
        description: 'Decomposes overall sequence probability into step-by-step conditional predictions.'
      }
    ],
    keyHighlights: [
      '3D Double Helix Matrix: Visual representation of stacked transformer representations',
      'Sliding Context Window Box: Bounding box enclosing active sequence tokens',
      'Interactive Temperature & Top-P controls: Watch candidate token height bars shift'
    ],
    parameters: [
      { label: 'Sampling Temperature (T)', key: 'temperature', value: 0.7, min: 0.1, max: 2.0, step: 0.05 },
      { label: 'Top-P Nucleus Threshold', key: 'topP', value: 0.9, min: 0.1, max: 1.0, step: 0.05 },
      { label: 'Context Window Length', key: 'contextLength', value: 8, min: 4, max: 16, step: 1 }
    ]
  }
};
