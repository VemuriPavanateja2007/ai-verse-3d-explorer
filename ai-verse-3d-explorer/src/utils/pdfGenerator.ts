import { jsPDF } from 'jspdf';
import katex from 'katex';
import html2canvas from 'html2canvas';
import { ConceptData } from '../types';

// Helper to clean and format inline LaTeX tokens into clean Unicode text
function cleanLatexForPdf(input: string): string {
  if (!input) return '';
  return input
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)')
    .replace(/\\mathcal\{([^}]+)\}/g, '$1')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\left|\\right/g, '')
    .replace(/\\cdot/g, ' · ')
    .replace(/\\times/g, ' × ')
    .replace(/\\approx/g, ' ≈ ')
    .replace(/\\ge/g, ' ≥ ')
    .replace(/\\le/g, ' ≤ ')
    .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, 'Σ($1 to $2)')
    .replace(/\\sum/g, 'Σ')
    .replace(/\\prod/g, 'Π')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\partial/g, '∂')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\delta/g, 'δ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\Phi/g, 'Φ')
    .replace(/\\tanh/g, 'tanh')
    .replace(/\\softmax/g, 'softmax')
    .replace(/\\log/g, 'log')
    .replace(/\\exp/g, 'exp')
    .replace(/\\odot/g, '⊙')
    .replace(/\^\{([^}]+)\}/g, '^($1)')
    .replace(/_\{([^}]+)\}/g, '_($1)')
    .replace(/\$/g, '');
}

// Render KaTeX LaTeX formula to high-resolution PNG image for PDF embedding
async function renderLatexToDataUrl(
  latex: string,
  displayMode = true
): Promise<{ dataUrl: string; widthMm: number; heightMm: number } | null> {
  if (!latex) return null;
  try {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.padding = '10px 18px';
    container.style.background = '#f8fafc'; // slate-50
    container.style.color = '#0f172a'; // slate-900
    container.style.fontSize = '22px';
    container.style.fontFamily = 'KaTeX_Main, Times New Roman, serif';
    container.style.display = 'inline-block';
    container.style.border = '1px solid #e2e8f0';
    container.style.borderRadius = '6px';

    // Render KaTeX HTML
    container.innerHTML = katex.renderToString(latex, {
      displayMode,
      throwOnError: false
    });

    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      backgroundColor: '#f8fafc',
      scale: 3, // High DPI for crystal-clear math text in PDF
      logging: false
    });

    document.body.removeChild(container);

    if (canvas.width > 0 && canvas.height > 0) {
      const maxW = 160; // Max printable mm width in PDF
      const scaleFactor = 0.22;
      const rawW = (canvas.width / 3) * scaleFactor;
      const rawH = (canvas.height / 3) * scaleFactor;

      const finalW = Math.min(rawW, maxW);
      const finalH = (rawH * finalW) / (rawW || 1);

      return {
        dataUrl: canvas.toDataURL('image/png'),
        widthMm: Math.max(25, finalW),
        heightMm: Math.max(10, Math.min(finalH, 28))
      };
    }
    return null;
  } catch (err) {
    console.warn('Failed to render KaTeX formula image:', err);
    return null;
  }
}

// Topic-specific detailed technical & educational explanations
function getTopicDetailedNotes(category: string, title: string) {
  const cat = category.toLowerCase();
  
  if (cat === 'dnn') {
    return {
      overview: `Deep Neural Networks (DNNs) form the bedrock of modern artificial intelligence. Consisting of interconnected layers of computational units (neurons), DNNs map high-dimensional input vectors to target output spaces through successive non-linear affine transformations. Each synaptic connection maintains a learnable weight parameter ($W$) and bias ($b$). During feedforward inference, information flows strictly from input to output layers. During training, the error signal is propagated backward via the chain rule of calculus to compute exact partial gradients ($\partial L / \partial W$), enabling weight optimization via AdamW or SGD momentum.`,
      foundations: [
        'Forward Propagation: Neurons compute a weighted dot-product sum $z = W \\cdot x + b$ followed by non-linear activation $a = \\sigma(z)$, allowing the network to approximate arbitrary non-linear target functions.',
        'Backpropagation Mechanics: Error gradients flow backwards through derivative matrix operations ($\\delta^l = (W^{l+1})^T \\delta^{l+1} \\odot \\sigma\'(z^l)$), dynamically attributing loss errors across deep synaptic layers.',
        'Activation Dynamics: Functions such as ReLU, GELU, or Swish prevent gradient saturation in deep networks while introducing necessary non-linear expressivity.'
      ],
      trainingDetails: [
        'Loss Functions: Mean Squared Error (MSE) for continuous regression; Categorical Cross-Entropy for multi-class classification logits.',
        'Regularization: Weight decay ($L_2$ regularization) and Dropout ($p=0.10$) randomly deactivate neurons during training to prevent over-memorization.',
        'Optimization: AdamW optimizer scales learning rates per parameter using exponential moving averages of first and second gradient moments.'
      ]
    };
  } else if (cat === 'cnn') {
    return {
      overview: `Convolutional Neural Networks (CNNs) are specialized deep architectures engineered for grid-structured spatial data such as 2D images and volumetric medical scans. Unlike fully-connected networks, CNNs leverage spatial locality, parameter sharing, and translation invariance. By sliding 2D learnable filter kernels across feature planes, CNNs extract a hierarchical spectrum of visual abstractions—progressing from low-level edges and textures in early layers to complex semantic object parts in deep layers. Spatial dimensions are periodically compressed using Max or Average Pooling, drastically reducing compute complexity while preserving spatial features.`,
      foundations: [
        'Spatial Convolution: Matrix sliding window operations $Y(i,j) = \\sum_{m} \\sum_{n} X(i+m, j+n) \\cdot K(m,n)$ extract localized visual patterns across spatial channels.',
        'Feature Map Resolution: Output dimensions follow $H_{out} = \\lfloor(H - K + 2P)/S\\rfloor + 1$, where $K$ is kernel size, $P$ is zero-padding, and $S$ is stride step.',
        'Pooling & Receptive Fields: Max Pooling downsamples feature maps by retaining peak activations, systematically expanding the receptive field of deeper convolutional layers.'
      ],
      trainingDetails: [
        'Data Augmentation: Random rotations, scaling, color jitter, and mixup prevent overfitting on spatial training sets.',
        'Transfer Learning: Fine-tuning pre-trained image backbones (ResNet, EfficientNet, ConvNeXt) accelerates convergence on custom domain datasets.',
        'Kernel Optimization: $3 \\times 3$ stacked convolutions achieve equal receptive fields to larger kernels with fewer total learnable parameters.'
      ]
    };
  } else if (cat === 'transformer') {
    return {
      overview: `The Transformer architecture revolutionized machine learning by replacing recurrent loops with parallelized Self-Attention mechanisms. Designed to capture long-range contextual dependencies across sequence tokens, Transformers project input vectors into Query ($Q$), Key ($K$), and Value ($V$) space. By calculating pairwise dot-product compatibility scores scaled by $\\sqrt{d_k}$, the model dynamically routes attention weights between all sequence elements simultaneously. Multi-Head Attention splits representations into parallel subspaces, enabling the network to attend to syntactic, semantic, and positional relationships concurrently.`,
      foundations: [
        'Scaled Dot-Product Attention: Computes contextual routing matrices via $\\text{Attention}(Q,K,V) = \\text{softmax}(QK^T / \\sqrt{d_k}) V$, maintaining unit variance gradient flow.',
        'Multi-Head Representation: Parallel attention heads project sequences into distinct representation subspaces: $\\text{MultiHead} = \\text{Concat}(\\text{head}_1, ..., \\text{head}_h) W^O$.',
        'Residual Stream & LayerNorm: Pre-Layer Normalization ($\\text{LN}$) and skip connections ($x + \\text{SubLayer}(x)$) stabilize deep gradient flow across 32+ transformer blocks.'
      ],
      trainingDetails: [
        'Positional Encoding: Sinusoidal or Rotary Positional Embeddings (RoPE) inject sequence order awareness into permutation-invariant attention matrices.',
        'Warmup Learning Rate: Linear warmup followed by Cosine Decay prevents early gradient instability during attention projection initializations.',
        'Attention Masking: Padding masks isolate padding tokens, ensuring zero attention weight allocation during batch computation.'
      ]
    };
  } else if (cat === 'llm') {
    return {
      overview: `Large Language Models (LLMs) represent generative AI backbones trained on massive text corpora to predict next-token probability distributions autoregressively. Based on decoder-only Transformer blocks, LLMs utilize causal self-attention masking to restrict token attention strictly to preceding context ($j \\le i$). High-dimensional word and subtoken embeddings capture rich semantic relationships. During inference, Key-Value (KV) caching eliminates redundant matrix multiplications, enabling real-time generation. Token sampling parameters (Temperature, Top-K, Top-P Nucleus) finely calibrate output randomness, creativity, and deterministic reasoning.`,
      foundations: [
        'Autoregressive Causal Decoding: Predicts probability distribution $P(w_t | w_1, ..., w_{t-1}) = \\text{softmax}(z_t / T)$ across subtoken vocabularies (e.g. 128k tokens).',
        'Causal Masking: Triangular attention mask matrix ($M_{ij} = -\\infty \\text{ for } j > i$) prevents future token information leakage during pretraining and generation.',
        'KV Caching: Persists Key and Value activation tensors across generation steps, transforming inference complexity from $O(N^2)$ to $O(N)$ per generated token.'
      ],
      trainingDetails: [
        'Decoding Sampling: Temperature $T \\in [0.1, 1.0]$ scales logit sharpess; Top-P (Nucleus) filters the cumulative probability tail for coherent generation.',
        'Alignment Tuning: Supervised Fine-Tuning (SFT) and Direct Preference Optimization (DPO) align raw base LLMs with user instructions and safety constraints.',
        'Quantization: INT8 and INT4 weight quantization compress model VRAM footprints by 50-75% with negligible accuracy drop.'
      ]
    };
  }

  // Custom fallback
  return {
    overview: `This custom neural architecture (${title}) is designed for tailored deep learning tasks. It integrates specialized tensor transformation layers, non-linear activation functions, and optimized parameter paths to extract complex representations from input data vectors. The system synchronizes structural layer specifications with mathematical optimization routines.`,
    foundations: [
      'Input Ingestion: Normalizes raw input vectors into high-dimensional hidden embeddings.',
      'Core Transformations: Applies learnable weight matrix multiplications $W \\cdot x + b$ and non-linear activations.',
      'Output Decision Head: Projects final hidden states into target logit probability distributions.'
    ],
    trainingDetails: [
      'Optimization: Gradient descent updates weights along negative loss gradients.',
      'Stability: Layer normalization and gradient clipping prevent numerical overflow during deep training.',
      'Inference: Optimized tensor compilation delivers low-latency evaluation.'
    ]
  };
}

export async function generateConceptPDF(
  concept: ConceptData,
  canvasElement?: HTMLCanvasElement | null
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 12; // 12mm left/right margin
  const contentWidth = pageWidth - margin * 2; // 186mm printable width

  const topicNotes = getTopicDetailedNotes(concept.category, concept.title);

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Helper function to draw consistent header on each page
  const drawPageHeader = (pageNum: number, pageTitle: string) => {
    // Top Banner Bar
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 22, 'F');

    // Accent Stripe
    doc.setFillColor(99, 102, 241); // indigo-500
    doc.rect(0, 21.5, pageWidth, 0.8, 'F');

    // App Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('AI-Verse 3D Architecture Report', margin, 10.5);

    // Subtitle / Page Title
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(199, 210, 254);
    
    // Safely clip subtitle text if too long
    const subTitleText = `${concept.title} — Page ${pageNum} of 4: ${pageTitle}`;
    const subTitleLines = doc.splitTextToSize(subTitleText, contentWidth - 40);
    doc.text(subTitleLines[0], margin, 17);

    // Date
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${dateStr}`, pageWidth - margin - 32, 17);
  };

  // Helper function to draw page footer
  const drawPageFooter = (pageNum: number) => {
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 11, pageWidth, 11, 'F');

    doc.setDrawColor(226, 232, 240);
    doc.line(0, pageHeight - 11, pageWidth, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('AI-Verse 3D Explorer — Tactile Neural Architecture Platform', margin, pageHeight - 4.5);

    doc.setFont('helvetica', 'bold');
    doc.text(`Page ${pageNum} of 4`, pageWidth - margin - 18, pageHeight - 4.5);
  };

  // =========================================================================
  // PAGE 1: EXECUTIVE OVERVIEW & HIGH-RESOLUTION 3D SNAPSHOT
  // =========================================================================
  drawPageHeader(1, 'Executive Overview & 3D Snapshot');
  let cursorY = 27;

  // 1. High-Resolution 3D Canvas Viewport Snapshot
  if (canvasElement) {
    try {
      // Capture canvas snapshot image
      const dataUrl = canvasElement.toDataURL('image/png', 1.0);
      
      const aspect = canvasElement.height / canvasElement.width || 0.55;
      const snapshotWidth = contentWidth;
      const rawHeight = snapshotWidth * aspect;
      const maxSnapHeight = 72; // cap height at 72mm
      const snapshotHeight = Math.min(rawHeight, maxSnapHeight);

      // Framed Container Box
      doc.setFillColor(2, 6, 23); // slate-950 dark viewport frame
      doc.setDrawColor(51, 65, 85);
      doc.roundedRect(margin, cursorY, snapshotWidth, snapshotHeight + 4, 3, 3, 'FD');

      // Draw high-res canvas image
      doc.addImage(dataUrl, 'PNG', margin + 1.5, cursorY + 2, snapshotWidth - 3, snapshotHeight, undefined, 'FAST');

      // Overlay Badge Title
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin + 4, cursorY + 4, 58, 6, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(56, 189, 248); // cyan-400
      doc.text('High-Res 3D Viewport Snapshot', margin + 6, cursorY + 8);

      cursorY += snapshotHeight + 9;
    } catch (e) {
      console.warn('Canvas snapshot capture failed:', e);
    }
  }

  // 2. Executive Architectural Overview Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Executive Concept Overview', margin, cursorY);
  cursorY += 4.5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);

  // Combine concept summary and topic overview
  const cleanSummary = cleanLatexForPdf(concept.summary);
  const summaryLines = doc.splitTextToSize(cleanSummary, contentWidth - 8);
  const overviewLines = doc.splitTextToSize(cleanLatexForPdf(topicNotes.overview), contentWidth - 8);

  const totalOverviewLines = [...summaryLines, '', ...overviewLines];
  const summaryBoxH = totalOverviewLines.length * 4.0 + 7;

  doc.roundedRect(margin, cursorY, contentWidth, summaryBoxH, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(51, 65, 85);
  
  let tempY = cursorY + 5;
  totalOverviewLines.forEach((line) => {
    if (line === '') {
      tempY += 2;
    } else {
      doc.text(line, margin + 4, tempY);
      tempY += 4.0;
    }
  });

  cursorY += summaryBoxH + 7;

  // 3. Core Architectural Highlights & Pillars
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('2. Core Architectural Pillars & Features', margin, cursorY);
  cursorY += 4.5;

  concept.keyHighlights.forEach((highlight) => {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    
    const cleanHighlight = cleanLatexForPdf(highlight);
    const highlightLines = doc.splitTextToSize(cleanHighlight, contentWidth - 12);
    const cardH = highlightLines.length * 4.0 + 5;

    doc.roundedRect(margin, cursorY, contentWidth, cardH, 2, 2, 'FD');

    // Bullet Circle
    doc.setFillColor(79, 70, 229);
    doc.circle(margin + 4, cursorY + 4.5, 1.2, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(30, 41, 59);
    doc.text(highlightLines, margin + 8, cursorY + 5);

    cursorY += cardH + 3;
  });

  drawPageFooter(1);

  // =========================================================================
  // PAGE 2: MATHEMATICAL FOUNDATIONS & KATEX RENDERED FORMULAS
  // =========================================================================
  doc.addPage();
  drawPageHeader(2, 'Mathematical Foundations & Equations');
  cursorY = 28;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Governing Equations & Mathematical Formulations', margin, cursorY);
  cursorY += 5;

  // Render KaTeX Formulas to Crisp PNG Images for PDF
  if (concept.mathFormulas && concept.mathFormulas.length > 0) {
    for (let idx = 0; idx < concept.mathFormulas.length; idx++) {
      const formula = concept.mathFormulas[idx];
      const katexImg = await renderLatexToDataUrl(formula.expression, true);
      const cleanDesc = cleanLatexForPdf(formula.description);
      const descLines = doc.splitTextToSize(cleanDesc, contentWidth - 10);

      const eqImageH = katexImg ? katexImg.heightMm + 4 : 10;
      const cardH = 8 + eqImageH + descLines.length * 3.8 + 5;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, cursorY, contentWidth, cardH, 2, 2, 'FD');

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(79, 70, 229); // indigo-600
      doc.text(`Formula ${idx + 1}: ${formula.title}`, margin + 4, cursorY + 5.5);

      // Embedded KaTeX Equation Image
      let imgEndY = cursorY + 7;
      if (katexImg) {
        const imgX = margin + (contentWidth - katexImg.widthMm) / 2;
        doc.addImage(
          katexImg.dataUrl,
          'PNG',
          Math.max(margin + 4, imgX),
          cursorY + 7,
          katexImg.widthMm,
          katexImg.heightMm
        );
        imgEndY = cursorY + 7 + katexImg.heightMm + 2;
      } else {
        // Fallback Unicode text if render fails
        doc.setFont('courier', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(cleanLatexForPdf(formula.expression), margin + 6, cursorY + 11);
        imgEndY = cursorY + 14;
      }

      // Formula Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      
      let dY = imgEndY + 2;
      descLines.forEach((dLine: string) => {
        doc.text(dLine, margin + 4, dY);
        dY += 3.8;
      });

      cursorY += cardH + 4;
    }
  }

  // Deep Theoretical Mechanics & Foundations
  cursorY += 1;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('2. Deep Mathematical Mechanics & Optimization Dynamics', margin, cursorY);
  cursorY += 5;

  topicNotes.foundations.forEach((foundNote) => {
    const cleanNote = cleanLatexForPdf(foundNote);
    const noteLines = doc.splitTextToSize(cleanNote, contentWidth - 10);
    const boxH = noteLines.length * 3.8 + 5;

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, cursorY, contentWidth, boxH, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    
    let nY = cursorY + 4.5;
    noteLines.forEach((nLine: string) => {
      doc.text(nLine, margin + 4, nY);
      nY += 3.8;
    });

    cursorY += boxH + 3;
  });

  drawPageFooter(2);

  // =========================================================================
  // PAGE 3: DETAILED LAYER-BY-LAYER ARCHITECTURAL BREAKDOWN
  // =========================================================================
  doc.addPage();
  drawPageHeader(3, 'Layer-by-Layer Architectural Breakdown');
  cursorY = 28;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Sequential Layer Pipeline & Tensor Transformations', margin, cursorY);
  cursorY += 5;

  if (concept.architectureBreakdown && concept.architectureBreakdown.length > 0) {
    concept.architectureBreakdown.forEach((layer, idx) => {
      const cleanDesc = cleanLatexForPdf(layer.description);
      const descLines = doc.splitTextToSize(cleanDesc, contentWidth - 10);

      const activationStr = layer.activationFunction ? cleanLatexForPdf(layer.activationFunction) : 'None';
      const metaText = `Role: ${layer.role}  |  Tensor Dim: ${layer.dimensions || 'N/A'}  |  Units: ${layer.nodesCount}  |  Activation: ${activationStr}`;
      
      const metaLines = doc.splitTextToSize(metaText, contentWidth - 10);

      let detailsHeight = 0;
      let cleanedDetailsLines: string[][] = [];
      if (layer.details && layer.details.length > 0) {
        layer.details.forEach((dt) => {
          const cdt = cleanLatexForPdf(dt);
          const lines = doc.splitTextToSize(`• ${cdt}`, contentWidth - 14);
          cleanedDetailsLines.push(lines);
          detailsHeight += lines.length * 3.6;
        });
      }

      const cardH = 8 + metaLines.length * 3.6 + descLines.length * 3.8 + detailsHeight + 5;

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, cursorY, contentWidth, cardH, 2, 2, 'FD');

      // Title & Layer Index
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`Stage ${idx + 1}: ${layer.name}`, margin + 4, cursorY + 5);

      // Meta Specs Line (wrapped)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(79, 70, 229);
      
      let mY = cursorY + 9;
      metaLines.forEach((mLine: string) => {
        doc.text(mLine, margin + 4, mY);
        mY += 3.6;
      });

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      
      let dY = mY + 1;
      descLines.forEach((dLine: string) => {
        doc.text(dLine, margin + 4, dY);
        dY += 3.8;
      });

      // Details Bullet Points
      if (cleanedDetailsLines.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);

        let dtY = dY + 1;
        cleanedDetailsLines.forEach((dtLinesGroup) => {
          dtLinesGroup.forEach((dtLine) => {
            doc.text(dtLine, margin + 6, dtY);
            dtY += 3.6;
          });
        });
      }

      cursorY += cardH + 4;
    });
  }

  drawPageFooter(3);

  // =========================================================================
  // PAGE 4: TRAINING DYNAMICS, HYPERPARAMETERS & DEPLOYMENT
  // =========================================================================
  doc.addPage();
  drawPageHeader(4, 'Training Dynamics & Deployment Specifications');
  cursorY = 28;

  // 1. Recommended Hyperparameter Table (Strictly Margined)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Recommended Architectural Hyperparameters', margin, cursorY);
  cursorY += 5;

  // Table Column Widths (total 186mm = 52 + 50 + 84)
  const col1W = 52;
  const col2W = 50;
  const col3W = 84;

  const col1X = margin;
  const col2X = margin + col1W;
  const col3X = margin + col1W + col2W;

  // Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, cursorY, contentWidth, 6.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(255, 255, 255);
  doc.text('Hyperparameter', col1X + 3, cursorY + 4.5);
  doc.text('Current Value', col2X + 3, cursorY + 4.5);
  doc.text('Optimal Training Range & Schedule', col3X + 3, cursorY + 4.5);

  cursorY += 6.5;

  // Table Rows with wrapped text per column
  const paramRows = [
    { label: 'Learning Rate (η)', val: '0.001 (AdamW)', range: '1e-4 to 1e-2 with Cosine Decay Warmup' },
    { label: 'Gradient Clipping Norm', val: '1.0 Max Norm', range: '0.5 to 2.0 (Prevents Exploding Gradients)' },
    { label: 'Dropout Rate (p)', val: '0.10 Probability', range: '0.05 to 0.20 (Regularization)' },
    { label: 'Batch Sequence Size', val: '64 Sequences', range: '32 to 512 depending on GPU VRAM' },
    { label: 'Precision Format', val: 'bfloat16 / FP16', range: 'Mixed Precision AMP for 2x Throughput' }
  ];

  paramRows.forEach((row, rIdx) => {
    const c1Lines = doc.splitTextToSize(row.label, col1W - 5);
    const c2Lines = doc.splitTextToSize(row.val, col2W - 5);
    const c3Lines = doc.splitTextToSize(row.range, col3W - 5);

    const maxLines = Math.max(c1Lines.length, c2Lines.length, c3Lines.length);
    const rowH = Math.max(6.5, maxLines * 3.8 + 3);

    // Row Background
    doc.setFillColor(rIdx % 2 === 0 ? 248 : 255, rIdx % 2 === 0 ? 250 : 255, rIdx % 2 === 0 ? 252 : 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, cursorY, contentWidth, rowH, 'FD');

    // Vertical Divider lines
    doc.line(col2X, cursorY, col2X, cursorY + rowH);
    doc.line(col3X, cursorY, col3X, cursorY + rowH);

    // Col 1 Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    let y1 = cursorY + 4;
    c1Lines.forEach((line: string) => {
      doc.text(line, col1X + 3, y1);
      y1 += 3.8;
    });

    // Col 2 Text
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(79, 70, 229);
    let y2 = cursorY + 4;
    c2Lines.forEach((line: string) => {
      doc.text(line, col2X + 3, y2);
      y2 += 3.8;
    });

    // Col 3 Text
    doc.setTextColor(71, 85, 105);
    let y3 = cursorY + 4;
    c3Lines.forEach((line: string) => {
      doc.text(line, col3X + 3, y3);
      y3 += 3.8;
    });

    cursorY += rowH;
  });

  cursorY += 6;

  // 2. Training Dynamics & Practical Guidelines
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('2. Practical Training & Convergence Strategies', margin, cursorY);
  cursorY += 5;

  topicNotes.trainingDetails.forEach((trDetail) => {
    const cleanDetail = cleanLatexForPdf(trDetail);
    const dLines = doc.splitTextToSize(cleanDetail, contentWidth - 10);
    const bH = dLines.length * 3.8 + 4.5;

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, cursorY, contentWidth, bH, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    
    let dy = cursorY + 4.2;
    dLines.forEach((line: string) => {
      doc.text(line, margin + 4, dy);
      dy += 3.8;
    });

    cursorY += bH + 3;
  });

  cursorY += 2;

  // 3. Deployment & Production Guidelines
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('3. Production Deployment & Hardware Optimization', margin, cursorY);
  cursorY += 5;

  const deploymentBox = [
    '• Model Quantization: Apply INT8 or INT4 weight quantization to reduce memory footprint by 50-75% with minimal impact on output precision.',
    '• Kernel Fusion & Acceleration: Utilize TensorRT or FlashAttention compiled kernels to fuse elementwise operations and optimize GPU memory bandwidth.',
    '• Continuous Batching & KV Caching: Implement dynamic request queuing and cached Key-Value activation persistence for high-throughput inference serving.'
  ];

  deploymentBox.forEach((depNote) => {
    const cleanDep = cleanLatexForPdf(depNote);
    const depLines = doc.splitTextToSize(cleanDep, contentWidth - 10);
    const depH = depLines.length * 3.8 + 4.5;

    doc.setFillColor(238, 242, 255);
    doc.setDrawColor(199, 210, 254);
    doc.roundedRect(margin, cursorY, contentWidth, depH, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);

    let depY = cursorY + 4.2;
    depLines.forEach((line: string) => {
      doc.text(line, margin + 4, depY);
      depY += 3.8;
    });

    cursorY += depH + 3;
  });

  drawPageFooter(4);

  // Save PDF Report
  const filename = `${concept.title.replace(/[^a-zA-Z0-9]/g, '_')}_4Page_Architecture_Report.pdf`;
  doc.save(filename);
}
