/* @flow */
'use strict';

import AbstractMethod from './AbstractMethod';
import { validateParams } from './helpers/paramsValidator';
import type { Success } from '../../types/trezor';
import type { CoreMessage } from '../../types';

import { stripHexPrefix } from '../../utils/ethereumUtils';

type Params = {
    address: string,
    signature: string,
    message: string,
}

export default class EthereumVerifyMessage extends AbstractMethod {
    params: Params;

    constructor(message: CoreMessage) {
        super(message);

        this.requiredPermissions = ['read', 'write'];
        // this.requiredFirmware = ['1.6.2', '2.0.7'];
        this.info = 'Verify message';

        const payload: Object = message.payload;

        // validate incoming parameters
        validateParams(payload, [
            { name: 'address', type: 'string', obligatory: true },
            { name: 'signature', type: 'string', obligatory: true },
            { name: 'message', type: 'string', obligatory: true },
        ]);

        const messageHex: string = Buffer.from(payload.message, 'utf8').toString('hex');
        this.params = {
            address: stripHexPrefix(payload.address),
            signature: stripHexPrefix(payload.signature),
            message: messageHex,
        };
    }

    async run(): Promise<Success> {
        return await this.device.getCommands().ethereumVerifyMessage(
            this.params.address,
            this.params.signature,
            this.params.message,
        );
    }
}
