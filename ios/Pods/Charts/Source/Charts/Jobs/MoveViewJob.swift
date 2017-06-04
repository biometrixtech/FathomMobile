//
//  MoveViewJob.swift
//  Charts
//
//  Copyright 2015 Daniel Cohen Gindi & Philipp Jahoda
//  A port of MPAndroidChart for iOS
//  Licensed under Apache License 2.0
//
//  https://github.com/danielgindi/Charts
//

import Foundation
import CoreGraphics

#if !os(OSX)
    import UIKit
#endif

@objc(MoveChartViewJob)
open class MoveViewJob: ViewPortJob
{
    public override init(
        viewPortHandler: ViewPortHandler,
        xValue: Double,
        yValue: Double,
        transformer: Transformer,
        view: ChartViewBase)
    {
        super.init(
            viewPortHandler: viewPortHandler,
            xValue: xValue,
            yValue: yValue,
            transformer: transformer,
            view: view)
    }
    
    open override func doJob()
    {
        guard
            let viewPortHandler = viewPortHandler,
            let transformer = transformer,
            let view = view
            else { return }
        
        var pt = CGPoint(
            x: CGFloat(xValue),
            y: CGFloat(yValue)
        )
        
        transformer.pointValueToPixel(&pt)
        viewPortHandler.centerViewPort(pt: pt, chart: view)
    }
}
